import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const comics = JSON.parse(readFileSync(path.join(ROOT, "comics.json"), "utf8"));

test("comic archive data is ordered newest first", () => {
  for (let index = 1; index < comics.length; index += 1) {
    assert.ok(comics[index - 1].published_at >= comics[index].published_at);
  }
});

test("comic media referenced by data exists under public/comics", () => {
  for (const comic of comics) {
    assert.ok(comic.slug, "comic slug is required");
    assert.ok(comic.person, `${comic.slug} person is required`);
    assert.ok(Array.isArray(comic.pages) && comic.pages.length > 0, `${comic.slug} needs pages`);

    for (const page of comic.pages) {
      assert.ok(existsSync(path.join(ROOT, "public", "comics", comic.slug, page)), `${comic.slug} missing page ${page}`);
    }

    if (comic.pdf) {
      assert.ok(existsSync(path.join(ROOT, "public", "comics", comic.slug, comic.pdf)), `${comic.slug} missing PDF ${comic.pdf}`);
    }

    if (comic.contact_sheet) {
      assert.ok(existsSync(path.join(ROOT, "public", "comics", comic.slug, comic.contact_sheet)), `${comic.slug} missing contact sheet ${comic.contact_sheet}`);
    }
  }
});
