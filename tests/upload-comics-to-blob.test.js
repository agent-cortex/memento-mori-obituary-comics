import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectComicAssets,
  comicAssetBlobPath,
  uploadComicAssets,
} from "../scripts/upload_comics_to_blob.js";

test("comicAssetBlobPath strips public/ while preserving the Blob key", () => {
  assert.equal(
    comicAssetBlobPath(
      "/repo",
      path.join("/repo", "public", "comics", "sample", "pages", "01.jpg"),
    ),
    "comics/sample/pages/01.jpg",
  );
});

test("collectComicAssets scans public/comics binaries for upload", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "memento-blob-assets-"));
  await mkdir(path.join(root, "public", "comics", "sample", "pages"), { recursive: true });
  await writeFile(path.join(root, "public", "comics", "sample", "pages", "01.jpg"), "jpg");
  await writeFile(path.join(root, "public", "comics", "sample", "sample.pdf"), "pdf");
  await writeFile(path.join(root, "public", "comics", "sample", "comic.json"), "{}");

  const assets = await collectComicAssets(root);

  assert.deepEqual(
    assets.map((asset) => asset.blobPath),
    ["comics/sample/pages/01.jpg", "comics/sample/sample.pdf"],
  );
});

test("uploadComicAssets writes private Blob objects without random suffixes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "memento-blob-upload-"));
  const puts = [];
  await mkdir(path.join(root, "public", "comics", "sample", "pages"), { recursive: true });
  await writeFile(path.join(root, "public", "comics", "sample", "pages", "01.jpg"), "jpg");

  await uploadComicAssets({
    blobClient: {
      async put(blobPath, _body, options) {
        puts.push({ blobPath, options });
      },
    },
    logger: { log() {} },
    rootDir: root,
    slug: "sample",
  });

  assert.deepEqual(puts, [
    {
      blobPath: "comics/sample/pages/01.jpg",
      options: {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 31536000,
        contentType: "image/jpeg",
      },
    },
  ]);
});
