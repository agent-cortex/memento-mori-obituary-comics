import { get as getBlob } from "@vercel/blob";
import { Hono } from "hono";

import {
  buildBlobMediaHeaders,
  requestPathToBlobPath,
} from "./blob-media.helpers.js";

const MEDIA_ENDPOINT_PATHS = ["/media/*", "/api/blob-media", "/api/blob-media/"];

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

  for (const endpointPath of MEDIA_ENDPOINT_PATHS) {
    app.get(endpointPath, c => serveBlobMedia(c.req.raw, blobClient));
    app.on("HEAD", endpointPath, c => serveBlobMedia(c.req.raw, blobClient));
  }

  return app;
}

let cachedApp;

function getApp() {
  if (!cachedApp) {
    cachedApp = createApp();
  }
  return cachedApp;
}

export function GET(request) {
  return getApp().fetch(request);
}

export function HEAD(request) {
  return getApp().fetch(request);
}
