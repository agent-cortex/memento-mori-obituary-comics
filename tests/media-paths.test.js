import assert from "node:assert/strict";
import test from "node:test";

import { firstImagePath as presenterFirstImagePath, mediaPath as presenterMediaPath } from "../lib/comic-presenters.js";

const comic = {
  slug: "sample-comic",
  pages: ["pages/01-sample-comic.jpg"],
  pdf: "sample-comic.pdf",
};

test("client presenters use the Blob-backed /media URL space", () => {
  assert.equal(presenterMediaPath(comic, comic.pdf), "/media/comics/sample-comic/sample-comic.pdf");
  assert.equal(presenterFirstImagePath(comic), "/media/comics/sample-comic/pages/01-sample-comic.jpg");
});
