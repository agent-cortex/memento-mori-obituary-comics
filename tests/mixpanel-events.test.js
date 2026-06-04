import assert from "node:assert/strict";
import test from "node:test";

import { MIXPANEL_EVENT_NAMES, MIXPANEL_SCROLL_DEPTHS, attributionProperties, comicSlugFromPath, mixpanelTrackRequestBody, pageTrackingProperties, pageTypeFromPath } from "../lib/mixpanel-events.js";

test("Mixpanel event taxonomy covers core site activity", () => {
  assert.deepEqual(MIXPANEL_SCROLL_DEPTHS, [25, 50, 75, 90]);
  assert.ok(MIXPANEL_EVENT_NAMES.includes("page_viewed"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("comic_pdf_clicked"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("comic_share_clicked"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("reader_setting_changed"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("newsletter_form_submitted"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("support_zec_copied"));
});

test("pageTypeFromPath classifies public routes", () => {
  assert.equal(pageTypeFromPath("/"), "home");
  assert.equal(pageTypeFromPath("/obituary-stories/"), "obituary_stories");
  assert.equal(pageTypeFromPath("/obituary-articles/"), "obituary_articles");
  assert.equal(pageTypeFromPath("/obituary-lesson-plan/"), "obituary_lesson_plan");
  assert.equal(pageTypeFromPath("/obituary-research-guide/"), "obituary_research_guide");
  assert.equal(pageTypeFromPath("/obituary-vs-death-notice/"), "obituary_vs_death_notice");
  assert.equal(pageTypeFromPath("/obituary-vs-eulogy/"), "obituary_vs_eulogy");
  assert.equal(pageTypeFromPath("/what-not-to-include-in-an-obituary/"), "obituary_privacy_checklist");
  assert.equal(pageTypeFromPath("/fake-obituary-sites/"), "fake_obituary_sites");
  assert.equal(pageTypeFromPath("/how-to-submit-an-obituary-to-a-newspaper/"), "newspaper_obituary_submission");
  assert.equal(pageTypeFromPath("/obituary-cost/"), "obituary_cost");
  assert.equal(pageTypeFromPath("/obituary-checklist/"), "obituary_checklist");
  assert.equal(pageTypeFromPath("/obituary-mistakes-to-avoid/"), "obituary_mistakes");
  assert.equal(pageTypeFromPath("/memorial-donation-wording-obituary/"), "memorial_donation_wording");
  assert.equal(pageTypeFromPath("/how-to-write-an-obituary-story/"), "obituary_writing_guide");
  assert.equal(pageTypeFromPath("/obituary-writing-prompts/"), "obituary_writing_prompts");
  assert.equal(pageTypeFromPath("/life-story-obituary-template/"), "life_story_obituary_template");
  assert.equal(pageTypeFromPath("/obituary-examples/"), "obituary_examples");
  assert.equal(pageTypeFromPath("/obituary-story-worksheet/"), "obituary_story_worksheet");
  assert.equal(pageTypeFromPath("/what-are-obituary-comics/"), "obituary_comics_explainer");
  assert.equal(pageTypeFromPath("/educators-libraries/"), "educators_libraries");
  assert.equal(pageTypeFromPath("/about/"), "about");
  assert.equal(pageTypeFromPath("/press/"), "press");
  assert.equal(pageTypeFromPath("/newsletter/?utm_source=x"), "newsletter");
  assert.equal(pageTypeFromPath("/comics/frida-kahlo-broken-mirror/#read"), "comic_reader");
  assert.equal(pageTypeFromPath("/media/comics/frida-kahlo-broken-mirror/frida.pdf"), "comic_media");
  assert.equal(pageTypeFromPath("/api/latest-pdf"), "latest_pdf_api");
});

test("pageTrackingProperties extracts comic slug and UTM attribution", () => {
  assert.equal(comicSlugFromPath("/comics/viktor-frankl-meaning-under-ash/"), "viktor-frankl-meaning-under-ash");
  assert.deepEqual(attributionProperties("?utm_source=x&utm_medium=social&ignored=1"), {
    utm_source: "x",
    utm_medium: "social",
  });
  assert.deepEqual(pageTrackingProperties("/comics/primo-levi/", "?utm_campaign=launch"), {
    page_type: "comic_reader",
    comic_slug: "primo-levi",
    utm_campaign: "launch",
  });
});

test("mixpanelTrackRequestBody serializes events in the accepted /track shape", () => {
  const body = mixpanelTrackRequestBody({
    event: "page_viewed",
    properties: {
      token: "test-token",
      distinct_id: "test-user",
    },
  });

  const parsed = JSON.parse(new URLSearchParams(body).get("data"));
  assert.ok(Array.isArray(parsed));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].event, "page_viewed");
  assert.equal(parsed[0].properties.token, "test-token");
});
