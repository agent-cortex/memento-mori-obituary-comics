import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectComicAssets,
  comicAssetBlobPath,
  loadEnvFile,
} from "../scripts/upload_comics_to_blob.js";

test("comicAssetBlobPath preserves the comics-relative pathname for Blob", () => {
  assert.equal(
    comicAssetBlobPath(
      "/repo",
      path.join("/repo", "comics", "sample", "pages", "01.jpg"),
    ),
    "comics/sample/pages/01.jpg",
  );
});

test("collectComicAssets finds uploadable comic binaries only", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "memento-blob-assets-"));
  await mkdir(path.join(root, "comics", "sample", "pages"), { recursive: true });
  await writeFile(path.join(root, "comics", "sample", "pages", "01.jpg"), "jpg");
  await writeFile(path.join(root, "comics", "sample", "sample.pdf"), "pdf");
  await writeFile(path.join(root, "comics", "sample", "contact-sheet.png"), "png");
  await writeFile(path.join(root, "comics", "sample", "index.html"), "html");
  await writeFile(path.join(root, "comics", "sample", "comic.json"), "{}");

  const assets = await collectComicAssets(root);

  assert.deepEqual(
    assets.map(asset => asset.blobPath),
    [
      "comics/sample/contact-sheet.png",
      "comics/sample/pages/01.jpg",
      "comics/sample/sample.pdf",
    ],
  );
});

test("loadEnvFile reads local Blob credentials without overwriting existing env", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "memento-env-"));
  const envPath = path.join(root, ".env.local");
  const original = process.env.BLOB_READ_WRITE_TOKEN;

  try {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    await writeFile(envPath, "BLOB_READ_WRITE_TOKEN=from-file\n");
    loadEnvFile(envPath);
    assert.equal(process.env.BLOB_READ_WRITE_TOKEN, "from-file");

    process.env.BLOB_READ_WRITE_TOKEN = "already-set";
    loadEnvFile(envPath);
    assert.equal(process.env.BLOB_READ_WRITE_TOKEN, "already-set");
  } finally {
    if (original === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = original;
    }
  }
});
