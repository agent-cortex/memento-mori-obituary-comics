export function comicAssetBlobPath(comic, src = "") {
  if (!comic?.slug) throw new Error("Comic slug is required");
  const cleanSrc = String(src || "").replace(/^\/+/, "");
  return `comics/${comic.slug}/${cleanSrc}`.replace(/\/+$/, "");
}

export function comicMediaPath(comic, src = "") {
  return `/media/${comicAssetBlobPath(comic, src)}`.replace(/\/+$/, "/");
}
