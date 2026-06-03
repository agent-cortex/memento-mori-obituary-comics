import assert from "node:assert/strict";
import test from "node:test";

import { createApp, HEAD } from "../lib/blob-media.js";

test("GET /media/comics/:path serves private Blob content through cacheable site URLs", async () => {
  const calls = [];
  const app = createApp({
    blobClient: {
      async get(blobPath, options) {
        calls.push({ blobPath, options });
        return {
          stream: new Blob(["image-bytes"]).stream(),
          blob: {
            contentType: "image/jpeg",
            etag: "blob-etag",
            size: 11,
          },
        };
      },
    },
  });

  const response = await app.fetch(
    new Request("https://example.com/media/comics/sample/pages/01.jpg", {
      headers: { "if-none-match": "old-etag" },
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/jpeg");
  assert.equal(response.headers.get("content-length"), "11");
  assert.equal(response.headers.get("etag"), "blob-etag");
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, s-maxage=31536000, immutable");
  assert.deepEqual(calls, [
    {
      blobPath: "comics/sample/pages/01.jpg",
      options: { access: "private", ifNoneMatch: "old-etag" },
    },
  ]);
});

test("GET /media/comics/:path rejects unsafe paths before Blob access", async () => {
  const app = createApp({
    blobClient: {
      async get() {
        throw new Error("should not read Blob");
      },
    },
  });

  const response = await app.fetch(new Request("https://example.com/media/comics/sample/%2e%2e/secret.jpg"));

  assert.equal(response.status, 400);
});

test("HEAD export is available for media probes", () => {
  assert.equal(typeof HEAD, "function");
});
