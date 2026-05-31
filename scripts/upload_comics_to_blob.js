#!/usr/bin/env node
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { put as putBlob } from "@vercel/blob";

import { contentTypeForBlobPath } from "../api/blob-media.helpers.js";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ONE_YEAR = 31536000;
const UPLOADABLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".pdf"]);

export function loadEnvFile(filePath = path.join(ROOT_DIR, ".env.local")) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function isUploadableComicAsset(filePath) {
  return UPLOADABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

export function comicAssetBlobPath(rootDir, filePath) {
  const relativePath = toPosixPath(path.relative(rootDir, filePath));

  if (!relativePath.startsWith("comics/") || relativePath.includes("../")) {
    throw new Error(`Comic asset must be inside ${path.join(rootDir, "comics")}`);
  }

  return relativePath;
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function collectComicAssets(rootDir = ROOT_DIR) {
  const comicsDir = path.join(rootDir, "comics");
  const assets = [];

  for (const filePath of await walkFiles(comicsDir)) {
    if (!isUploadableComicAsset(filePath)) continue;

    const blobPath = comicAssetBlobPath(rootDir, filePath);
    const fileStat = await stat(filePath);
    assets.push({
      blobPath,
      contentType: contentTypeForBlobPath(blobPath),
      filePath,
      size: fileStat.size,
    });
  }

  return assets.sort((a, b) => a.blobPath.localeCompare(b.blobPath));
}

export async function uploadComicAssets({
  allowOverwrite = true,
  blobClient = { put: putBlob },
  dryRun = false,
  rootDir = ROOT_DIR,
} = {}) {
  const assets = await collectComicAssets(rootDir);

  for (const asset of assets) {
    if (dryRun) {
      console.log(`[dry-run] ${asset.blobPath} (${asset.contentType}, ${asset.size} bytes)`);
      continue;
    }

    await blobClient.put(asset.blobPath, createReadStream(asset.filePath), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite,
      cacheControlMaxAge: ONE_YEAR,
      contentType: asset.contentType,
    });
    console.log(`[uploaded] ${asset.blobPath}`);
  }

  return assets;
}

function parseArgs(argv) {
  return {
    allowOverwrite: !argv.includes("--no-overwrite"),
    dryRun: argv.includes("--dry-run"),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  loadEnvFile();

  if (!options.dryRun && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required to upload private Vercel Blob assets");
  }

  const assets = await uploadComicAssets(options);
  const action = options.dryRun ? "Found" : "Uploaded";
  console.log(`${action} ${assets.length} comic assets.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}
