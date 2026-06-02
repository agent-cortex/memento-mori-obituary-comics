import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  findLatestComicWithPdf,
  resolveComicPdfPath,
} from "../lib/latest-pdf.js";

test("findLatestComicWithPdf returns the newest comic with a PDF", () => {
  const comics = [
    { slug: "older", published_at: "2026-05-29", pdf: "older.pdf" },
    { slug: "newer", published_at: "2026-05-31", pdf: "newer.pdf" },
  ];

  assert.equal(findLatestComicWithPdf(comics).slug, "newer");
});

test("findLatestComicWithPdf keeps archive order when dates tie", () => {
  const comics = [
    { slug: "first", published_at: "2026-05-30", pdf: "first.pdf" },
    { slug: "second", published_at: "2026-05-30", pdf: "second.pdf" },
  ];

  assert.equal(findLatestComicWithPdf(comics).slug, "first");
});

test("findLatestComicWithPdf skips comics without PDF metadata", () => {
  const comics = [
    { slug: "newest-no-pdf", published_at: "2026-06-01" },
    { slug: "older-with-pdf", published_at: "2026-05-31", pdf: "older.pdf" },
  ];

  assert.equal(findLatestComicWithPdf(comics).slug, "older-with-pdf");
});

test("resolveComicPdfPath rejects traversal PDF names", () => {
  assert.throws(
    () => resolveComicPdfPath({ slug: "safe", pdf: "../secret.pdf" }, process.cwd()),
    /Unsafe PDF filename/,
  );
});

test("resolveComicPdfPath returns the expected in-comic PDF path", () => {
  const resolved = resolveComicPdfPath(
    { slug: "safe", pdf: "comic.pdf" },
    "/repo",
  );

  assert.equal(resolved, path.join("/repo", "public", "comics", "safe", "comic.pdf"));
});
