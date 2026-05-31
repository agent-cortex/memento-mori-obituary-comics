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
  if (segments.length < 3 || segments.some(segment => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
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

export function mediaPathForBlobPath(blobPath) {
  return `${MEDIA_PREFIX}${assertSafeBlobPath(blobPath)}`;
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
