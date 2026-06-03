#!/usr/bin/env node
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { put as putBlob } from "@vercel/blob";

import { contentTypeForBlobPath } from "../lib/blob-media.js";

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
  const publicPrefix = "public/comics/";

  if (!relativePath.startsWith(publicPrefix) || relativePath.includes("../")) {
    throw new Error(`Comic asset must be inside ${path.join(rootDir, "public", "comics")}`);
  }

  return `comics/${relativePath.slice(publicPrefix.length)}`;
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

export async function collectComicAssets(rootDir = ROOT_DIR, { slug = null } = {}) {
  const comicsDir = path.join(rootDir, "public", "comics");
  const scanDir = slug ? path.join(comicsDir, slug) : comicsDir;

  if (!existsSync(scanDir)) {
    throw new Error(slug
      ? `Comic slug not found: ${path.join("public", "comics", slug)}`
      : `Comics directory not found: ${comicsDir}`);
  }

  const assets = [];

  for (const filePath of await walkFiles(scanDir)) {
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
  logger = console,
  requireAssets = false,
  rootDir = ROOT_DIR,
  slug = null,
} = {}) {
  const assets = await collectComicAssets(rootDir, { slug });

  if (requireAssets && assets.length === 0) {
    throw new Error(slug
      ? `No uploadable comic assets found for slug: ${slug}`
      : "No uploadable comic assets found");
  }

  for (const asset of assets) {
    if (dryRun) {
      logger.log(`[dry-run] ${asset.blobPath} (${asset.contentType}, ${asset.size} bytes)`);
      continue;
    }

    await blobClient.put(asset.blobPath, createReadStream(asset.filePath), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite,
      cacheControlMaxAge: ONE_YEAR,
      contentType: asset.contentType,
    });
    logger.log(`[uploaded] ${asset.blobPath}`);
  }

  return assets;
}

function parseArgs(argv) {
  const slugIndex = argv.indexOf("--slug");
  const slug = slugIndex === -1 ? null : argv[slugIndex + 1];

  if (slugIndex !== -1 && (!slug || slug.startsWith("--"))) {
    throw new Error("--slug requires a comic slug, e.g. --slug frida-kahlo-broken-mirror");
  }

  return {
    allowOverwrite: !argv.includes("--no-overwrite"),
    dryRun: argv.includes("--dry-run"),
    requireAssets: argv.includes("--require-assets"),
    slug,
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
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
