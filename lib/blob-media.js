import { get as getBlob } from "@vercel/blob";
import { Hono } from "hono";

const MEDIA_PREFIX = "/media/";
const COMICS_PREFIX = "comics/";
const ONE_YEAR = 31536000;

const CONTENT_TYPES = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".pdf", "application/pdf"],
]);

function extensionFor(blobPath) {
  const index = blobPath.lastIndexOf(".");
  return index === -1 ? "" : blobPath.slice(index).toLowerCase();
}

export function contentTypeForBlobPath(blobPath) {
  return CONTENT_TYPES.get(extensionFor(blobPath)) || "application/octet-stream";
}

export function assertSafeBlobPath(blobPath) {
  if (!blobPath.startsWith(COMICS_PREFIX)) {
    throw new Error("Unsupported media path");
  }

  const segments = blobPath.split("/");
  if (segments.length < 3 || segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
    throw new Error("Unsafe media path");
  }

  if (!CONTENT_TYPES.has(extensionFor(blobPath))) {
    throw new Error("Unsupported media type");
  }

  return blobPath;
}

export function requestPathToBlobPath(url) {
  const rawQueryPath = url.searchParams.get("path");
  if (rawQueryPath) {
    const decodedQueryPath = decodeURIComponent(rawQueryPath).replace(/^\/+/, "");
    const queryBlobPath = decodedQueryPath.startsWith("media/")
      ? decodedQueryPath.slice("media/".length)
      : decodedQueryPath;
    return assertSafeBlobPath(queryBlobPath);
  }

  const decodedPath = decodeURIComponent(url.pathname);
  if (decodedPath.startsWith(COMICS_PREFIX)) {
    return assertSafeBlobPath(decodedPath);
  }

  if (!decodedPath.startsWith(`${MEDIA_PREFIX}${COMICS_PREFIX}`)) {
    throw new Error("Unsupported media path");
  }

  return assertSafeBlobPath(decodedPath.slice(MEDIA_PREFIX.length));
}

export function buildBlobMediaHeaders({ blobPath, contentLength, contentType, etag }) {
  const headers = {
    "Cache-Control": `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`,
    "CDN-Cache-Control": `public, max-age=${ONE_YEAR}, immutable`,
    "Content-Type": contentType || contentTypeForBlobPath(blobPath),
  };

  if (contentLength !== undefined && contentLength !== null) {
    headers["Content-Length"] = String(contentLength);
  }

  if (etag) {
    headers.ETag = etag;
  }

  if (blobPath.toLowerCase().endsWith(".pdf")) {
    const filename = blobPath.split("/").at(-1);
    headers["Content-Disposition"] = `inline; filename="${filename}"`;
  }

  return headers;
}

function jsonError(message, status) {
  return Response.json({ error: message }, { status });
}

async function serveBlobMedia(request, blobClient) {
  let blobPath;

  try {
    blobPath = requestPathToBlobPath(new URL(request.url));
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid media path", 400);
  }

  try {
    const ifNoneMatch = request.headers.get("if-none-match") || undefined;
    const options = ifNoneMatch
      ? { access: "private", ifNoneMatch }
      : { access: "private" };
    const result = await blobClient.get(blobPath, options);

    if (!result) {
      return jsonError("Media not found", 404);
    }

    if (result.statusCode === 304) {
      return new Response(null, {
        status: 304,
        headers: buildBlobMediaHeaders({
          blobPath,
          etag: result.blob?.etag,
        }),
      });
    }

    return new Response(result.stream, {
      headers: buildBlobMediaHeaders({
        blobPath,
        contentLength: result.blob?.size,
        contentType: result.blob?.contentType,
        etag: result.blob?.etag,
      }),
    });
  } catch (error) {
    console.error("blob media endpoint failed", error);
    return jsonError("Media is unavailable", 502);
  }
}

export function createApp(options = {}) {
  const app = new Hono();
  const blobClient = options.blobClient || { get: getBlob };

  app.get("/media/*", (c) => serveBlobMedia(c.req.raw, blobClient));
  app.on("HEAD", "/media/*", (c) => serveBlobMedia(c.req.raw, blobClient));

  return app;
}

let cachedApp;

export function getApp() {
  if (!cachedApp) cachedApp = createApp();
  return cachedApp;
}

export function GET(request) {
  return getApp().fetch(request);
}

export function HEAD(request) {
  return getApp().fetch(request);
}
