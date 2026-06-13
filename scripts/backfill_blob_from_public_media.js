#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { get as getBlob, put as putBlob } from "@vercel/blob";

import { assertSafeBlobPath, contentTypeForBlobPath } from "../lib/blob-media.js";
import { loadEnvFile } from "./upload_comics_to_blob.js";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ONE_YEAR = 31536000;
const DEFAULT_SOURCE_BASE = "https://www.finalnotes.page";
const DEFAULT_CONCURRENCY = 4;

function parseArgs(argv) {
  const valueAfter = (flag) => {
    const index = argv.indexOf(flag);
    if (index === -1) return null;
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    return value;
  };

  return {
    allowOverwrite: !argv.includes("--no-overwrite"),
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    requireAssets: argv.includes("--require-assets"),
    slug: valueAfter("--slug") || process.env.BLOB_BACKFILL_SLUG || null,
    sourceBase: (valueAfter("--source-base") || process.env.BLOB_BACKFILL_SOURCE_BASE || DEFAULT_SOURCE_BASE).replace(/\/+$/, ""),
    concurrency: Number(valueAfter("--concurrency") || process.env.BLOB_BACKFILL_CONCURRENCY || DEFAULT_CONCURRENCY),
  };
}

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
  );
}

function shouldRunOnBuild() {
  if (process.env.BLOB_BACKFILL_ON_BUILD === "0") return false;
  if (process.env.BLOB_BACKFILL_FORCE === "1") return true;
  return process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
}

function loadComics(rootDir = ROOT_DIR) {
  return JSON.parse(readFileSync(path.join(rootDir, "comics.json"), "utf8"));
}

export function collectComicMediaPaths(comics, { slug = null } = {}) {
  const selected = slug ? comics.filter((comic) => comic.slug === slug) : comics;
  if (slug && selected.length === 0) throw new Error(`Comic slug not found in comics.json: ${slug}`);

  const paths = [];
  for (const comic of selected) {
    const comicSlug = comic.slug;
    for (const pagePath of comic.pages || []) {
      paths.push(`comics/${comicSlug}/${pagePath}`);
    }
    if (comic.pdf) paths.push(`comics/${comicSlug}/${comic.pdf}`);
    if (comic.contact_sheet) paths.push(`comics/${comicSlug}/${comic.contact_sheet}`);
  }

  return [...new Set(paths)].map(assertSafeBlobPath).sort((a, b) => a.localeCompare(b));
}

async function sourceHead(sourceBase, blobPath) {
  const url = `${sourceBase}/media/${blobPath}`;
  const response = await fetch(url, { method: "HEAD" });
  return {
    ok: response.ok,
    status: response.status,
    contentLength: response.headers.get("content-length"),
    contentType: response.headers.get("content-type"),
    url,
  };
}

async function blobExists(blobClient, blobPath) {
  try {
    const result = await blobClient.get(blobPath, { access: "private" });
    return Boolean(result);
  } catch (error) {
    if (error?.status === 404 || error?.statusCode === 404) return false;
    return false;
  }
}

async function uploadFromSource({ allowOverwrite, blobClient, blobPath, dryRun, force, sourceBase }) {
  const contentType = contentTypeForBlobPath(blobPath);

  if (dryRun) {
    const head = await sourceHead(sourceBase, blobPath);
    if (!head.ok) throw new Error(`Source missing ${blobPath}: HTTP ${head.status}`);
    console.log(`[dry-run] ${blobPath} (${head.contentType || contentType}, ${head.contentLength || "unknown"} bytes)`);
    return "dry-run";
  }

  if (!force && await blobExists(blobClient, blobPath)) {
    console.log(`[exists] ${blobPath}`);
    return "exists";
  }

  const sourceUrl = `${sourceBase}/media/${blobPath}`;
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Source fetch failed for ${blobPath}: HTTP ${response.status}`);
  }

  const body = Buffer.from(await response.arrayBuffer());
  await blobClient.put(blobPath, body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite,
    cacheControlMaxAge: ONE_YEAR,
    contentType: response.headers.get("content-type") || contentType,
  });

  console.log(`[uploaded] ${blobPath}`);
  return "uploaded";
}

async function mapLimit(items, limit, worker) {
  const results = [];
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async (_, workerIndex) => {
    for (let index = workerIndex; index < items.length; index += Math.max(1, limit)) {
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function backfillBlobFromPublicMedia(options = {}) {
  const comics = loadComics(options.rootDir || ROOT_DIR);
  const blobPaths = collectComicMediaPaths(comics, { slug: options.slug });

  if (options.requireAssets && blobPaths.length === 0) {
    throw new Error("No comic media paths found to backfill");
  }

  const results = await mapLimit(blobPaths, options.concurrency || DEFAULT_CONCURRENCY, (blobPath) => uploadFromSource({
    allowOverwrite: options.allowOverwrite ?? true,
    blobClient: options.blobClient || { get: getBlob, put: putBlob },
    blobPath,
    dryRun: Boolean(options.dryRun),
    force: Boolean(options.force),
    sourceBase: options.sourceBase || DEFAULT_SOURCE_BASE,
  }));

  const counts = results.reduce((acc, result) => {
    acc[result] = (acc[result] || 0) + 1;
    return acc;
  }, {});
  console.log(`Backfill checked ${blobPaths.length} assets: ${JSON.stringify(counts)}`);
  return { blobPaths, counts };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  loadEnvFile();

  if (!options.dryRun && !shouldRunOnBuild() && process.env.BLOB_BACKFILL_FORCE !== "1") {
    console.log("Blob backfill skipped: not a Vercel production build. Set BLOB_BACKFILL_FORCE=1 to run manually.");
    return;
  }

  if (!options.dryRun && !hasBlobCredentials()) {
    throw new Error("Blob backfill needs BLOB_READ_WRITE_TOKEN or VERCEL_OIDC_TOKEN+BLOB_STORE_ID in the environment");
  }

  await backfillBlobFromPublicMedia(options);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
