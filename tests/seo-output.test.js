import assert from "node:assert/strict";
import test from "node:test";

import { GET as llmsTxt } from "../app/llms.txt/route.js";
import robots from "../app/robots.js";
import sitemap from "../app/sitemap.js";
import { comicImageMetadata, comicSchema, getComics, getLatestComic, homeSchema, sourceUrls } from "../lib/comics.js";
import { absoluteUrl, SITE_NAME, SITE_URL } from "../lib/site.js";

function graphNodes(schema) {
  return schema["@graph"] || [];
}

function findGraphNode(schema, matcher) {
  return graphNodes(schema).find(matcher);
}

test("robots policy exposes sitemap and AI search crawler access", () => {
  const output = robots();
  const rulesByAgent = new Map(output.rules.map((rule) => [rule.userAgent, rule]));

  assert.equal(output.sitemap, absoluteUrl("/sitemap.xml"));
  assert.equal(output.host, SITE_URL);
  assert.equal(rulesByAgent.get("Googlebot").allow, "/");
  assert.equal(rulesByAgent.get("Bingbot").allow, "/");
  assert.equal(rulesByAgent.get("GPTBot").allow, "/");
  assert.equal(rulesByAgent.get("OAI-SearchBot").allow, "/");
  assert.equal(rulesByAgent.get("ChatGPT-User").allow, "/");
  assert.equal(rulesByAgent.get("ClaudeBot").allow, "/");
  assert.equal(rulesByAgent.get("PerplexityBot").allow, "/");
  assert.equal(rulesByAgent.get("CCBot").disallow, "/");
  assert.equal(rulesByAgent.get("anthropic-ai").disallow, "/");
});

test("sitemap includes canonical public routes and comic permalinks", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.ok(urls.includes(absoluteUrl("/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-stories/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-articles/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-lesson-plan/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-research-guide/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-vs-death-notice/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-vs-eulogy/")));
  assert.ok(urls.includes(absoluteUrl("/what-not-to-include-in-an-obituary/")));
  assert.ok(urls.includes(absoluteUrl("/fake-obituary-sites/")));
  assert.ok(urls.includes(absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-cost/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-checklist/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-mistakes-to-avoid/")));
  assert.ok(urls.includes(absoluteUrl("/short-obituary-examples/")));
  assert.ok(urls.includes(absoluteUrl("/free-obituary-generator/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-wording/")));
  assert.ok(urls.includes(absoluteUrl("/memorial-donation-wording-obituary/")));
  assert.ok(urls.includes(absoluteUrl("/how-to-write-an-obituary-story/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-writing-prompts/")));
  assert.ok(urls.includes(absoluteUrl("/life-story-obituary-template/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-examples/")));
  assert.ok(urls.includes(absoluteUrl("/obituary-story-worksheet/")));
  assert.ok(urls.includes(absoluteUrl("/what-are-obituary-comics/")));
  assert.ok(urls.includes(absoluteUrl("/educators-libraries/")));
  assert.ok(urls.includes(absoluteUrl("/about/")));
  assert.ok(urls.includes(absoluteUrl("/press/")));
  assert.ok(urls.includes(absoluteUrl("/newsletter/")));

  for (const comic of getComics()) {
    assert.ok(urls.includes(absoluteUrl(`/comics/${comic.slug}/`)), `${comic.slug} missing from sitemap`);
  }
});

test("llms.txt describes canonical routes and citation policy", async () => {
  const response = llmsTxt();
  const body = await response.text();

  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.match(body, new RegExp(`# ${SITE_NAME}`));
  assert.match(body, /## Main pages/);
  assert.match(body, /## AI crawler access/);
  assert.match(body, new RegExp(absoluteUrl("/obituary-stories/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-articles/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-lesson-plan/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-research-guide/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-vs-death-notice/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-vs-eulogy/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/what-not-to-include-in-an-obituary/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/fake-obituary-sites/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-cost/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-checklist/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-mistakes-to-avoid/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/short-obituary-examples/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/free-obituary-generator/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-wording/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/memorial-donation-wording-obituary/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/how-to-write-an-obituary-story/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-writing-prompts/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/life-story-obituary-template/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-examples/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/obituary-story-worksheet/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/what-are-obituary-comics/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/educators-libraries/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, new RegExp(absoluteUrl("/press/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(body, /Prefer the canonical comic reader URL/);
  assert.match(body, /Do not treat panel art as a primary historical source/);
  assert.match(body, new RegExp(absoluteUrl("/newsletter/").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("home schema exposes collection and publisher entities", () => {
  const schema = homeSchema();
  const organization = findGraphNode(schema, (node) => node["@type"] === "Organization");
  const website = findGraphNode(schema, (node) => node["@type"] === "WebSite");
  const collection = findGraphNode(schema, (node) => node["@type"] === "CollectionPage");

  assert.equal(organization.name, SITE_NAME);
  assert.equal(website.publisher["@id"], `${SITE_URL}/#organization`);
  assert.equal(collection.mainEntity.itemListElement.length, getComics().length);
});

test("comic schema includes citable summary, page images, subject, and source citations", () => {
  const comic = getComics().find((item) => sourceUrls(item).length > 0) || getLatestComic();
  const schema = comicSchema(comic);
  const creativeWork = findGraphNode(schema, (node) => Array.isArray(node["@type"]) && node["@type"].includes("ComicStory"));
  const webpage = findGraphNode(schema, (node) => node["@type"] === "WebPage");
  const subject = findGraphNode(schema, (node) => node["@type"] === "Person");
  const summary = findGraphNode(schema, (node) => node["@id"]?.endsWith("#summary"));
  const images = comicImageMetadata(comic);

  assert.equal(webpage.about["@id"], subject["@id"]);
  assert.equal(creativeWork.publisher["@id"], `${SITE_URL}/#organization`);
  assert.equal(creativeWork.hasPart.length, comic.pages.length);
  assert.ok(summary.itemListElement.length >= 3);
  assert.ok(images[0].url.startsWith(`${SITE_URL}/media/comics/`));

  if (sourceUrls(comic).length > 0) {
    assert.deepEqual(creativeWork.citation, sourceUrls(comic));
  }
});
