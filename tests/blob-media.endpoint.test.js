import assert from "node:assert/strict";
import test from "node:test";

import { createApp, HEAD } from "../api/blob-media.js";

function streamFromText(text) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

test("GET /media/comics/:path serves private Blob content through cacheable site URLs", async () => {
  const calls = [];
  const app = createApp({
    blobClient: {
      async get(blobPath, options) {
        calls.push({ blobPath, options });
        return {
          statusCode: 200,
          stream: streamFromText("image-bytes"),
          blob: {
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
  assert.equal(await response.text(), "image-bytes");
  assert.equal(response.headers.get("content-type"), "image/jpeg");
  assert.match(response.headers.get("cache-control"), /s-maxage=31536000/);
  assert.equal(response.headers.get("etag"), "blob-etag");
  assert.deepEqual(calls, [
    {
      blobPath: "comics/sample/pages/01.jpg",
      options: {
        access: "private",
        ifNoneMatch: "old-etag",
      },
    },
  ]);
});

test("GET /media/comics/:path forwards Blob 304 responses", async () => {
  const app = createApp({
    blobClient: {
      async get() {
        return {
          statusCode: 304,
          blob: { etag: "same-etag", size: 0 },
        };
      },
    },
  });

  const response = await app.fetch(new Request("https://example.com/media/comics/sample/pages/01.jpg"));

  assert.equal(response.status, 304);
  assert.equal(response.headers.get("etag"), "same-etag");
});

test("HEAD /media/comics/:path returns private Blob headers without a body", async () => {
  const app = createApp({
    blobClient: {
      async get() {
        return {
          statusCode: 200,
          stream: streamFromText("image-bytes"),
          blob: {
            etag: "head-etag",
            size: 11,
          },
        };
      },
    },
  });

  const response = await app.fetch(
    new Request("https://example.com/media/comics/sample/pages/01.jpg", {
      method: "HEAD",
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
  assert.equal(response.headers.get("content-type"), "image/jpeg");
  assert.equal(response.headers.get("content-length"), "11");
  assert.match(response.headers.get("cache-control"), /s-maxage=31536000/);
});

test("api/blob-media exports a HEAD handler for Vercel asset probes", () => {
  assert.equal(typeof HEAD, "function");
});

test("GET /media/comics/:path rejects unsafe paths before Blob access", async () => {
  let called = false;
  const app = createApp({
    blobClient: {
      async get() {
        called = true;
        throw new Error("should not be called");
      },
    },
  });

  const response = await app.fetch(new Request("https://example.com/media/comics/sample/%2e%2e/secret.pdf"));

  assert.equal(response.status, 400);
  assert.equal(called, false);
});
