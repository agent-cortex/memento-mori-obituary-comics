import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBlobMediaHeaders,
  contentTypeForBlobPath,
  requestPathToBlobPath,
} from "../api/blob-media.helpers.js";

test("requestPathToBlobPath maps public media URLs to private Blob pathnames", () => {
  const url = new URL("https://example.com/media/comics/sample-comic/pages/01-sample-comic.jpg");

  assert.equal(
    requestPathToBlobPath(url),
    "comics/sample-comic/pages/01-sample-comic.jpg",
  );
});

test("requestPathToBlobPath maps rewritten Vercel query paths to private Blob pathnames", () => {
  const url = new URL("https://example.com/api/blob-media?path=comics/sample-comic/pages/01-sample-comic.jpg");

  assert.equal(
    requestPathToBlobPath(url),
    "comics/sample-comic/pages/01-sample-comic.jpg",
  );
});

test("requestPathToBlobPath rejects paths outside the comic media prefix", () => {
  assert.throws(
    () => requestPathToBlobPath(new URL("https://example.com/assets/style.css")),
    /Unsupported media path/,
  );
});

test("requestPathToBlobPath rejects traversal attempts", () => {
  assert.throws(
    () => requestPathToBlobPath(new URL("https://example.com/media/comics/sample/../secret.pdf")),
    /Unsafe media path/,
  );
});

test("contentTypeForBlobPath detects known comic asset types", () => {
  assert.equal(contentTypeForBlobPath("comics/sample/pages/01.jpg"), "image/jpeg");
  assert.equal(contentTypeForBlobPath("comics/sample/contact-sheet.png"), "image/png");
  assert.equal(contentTypeForBlobPath("comics/sample/sample.pdf"), "application/pdf");
});

test("buildBlobMediaHeaders makes site media cacheable at the CDN layer", () => {
  const headers = buildBlobMediaHeaders({
    blobPath: "comics/sample/pages/01.jpg",
    contentLength: 123,
    etag: "etag-123",
  });

  assert.equal(headers["Content-Type"], "image/jpeg");
  assert.equal(headers["Content-Length"], "123");
  assert.equal(headers.ETag, "etag-123");
  assert.match(headers["Cache-Control"], /public/);
  assert.match(headers["Cache-Control"], /s-maxage=31536000/);
  assert.match(headers["CDN-Cache-Control"], /max-age=31536000/);
});
