import path from "node:path";

export function findLatestComicWithPdf(comics) {
  if (!Array.isArray(comics)) {
    throw new TypeError("Expected comics to be an array");
  }

  let latest = null;
  let latestTime = Number.NEGATIVE_INFINITY;

  for (const comic of comics) {
    if (!comic || typeof comic !== "object" || !comic.pdf) continue;

    const publishedAt = Date.parse(comic.published_at || "");
    const publishedTime = Number.isNaN(publishedAt) ? Number.NEGATIVE_INFINITY : publishedAt;

    if (!latest || publishedTime > latestTime) {
      latest = comic;
      latestTime = publishedTime;
    }
  }

  if (!latest) {
    throw new Error("No published comic PDF found");
  }

  return latest;
}

export function resolveComicPdfPath(comic, rootDir) {
  if (!comic?.slug || !comic?.pdf) {
    throw new Error("Comic PDF metadata is incomplete");
  }

  if (path.basename(comic.pdf) !== comic.pdf) {
    throw new Error("Unsafe PDF filename");
  }

  return path.join(rootDir, "comics", comic.slug, comic.pdf);
}

export function resolveComicPdfBlobPath(comic) {
  if (!comic?.slug || !comic?.pdf) {
    throw new Error("Comic PDF metadata is incomplete");
  }

  if (path.basename(comic.pdf) !== comic.pdf) {
    throw new Error("Unsafe PDF filename");
  }

  return path.posix.join("comics", comic.slug, comic.pdf);
}

export function buildPdfHeaders(comic, contentLength) {
  const filename = path.basename(comic.pdf);
  return {
    "Cache-Control": "private, no-store",
    "Content-Disposition": `inline; filename="${filename}"`,
    "Content-Length": String(contentLength),
    "Content-Type": "application/pdf",
    "X-Comic-Slug": comic.slug,
  };
}

export function jsonError(message, status = 500) {
  return Response.json({ error: message }, { status });
}
