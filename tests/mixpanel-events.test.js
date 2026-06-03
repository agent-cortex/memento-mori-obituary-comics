import assert from "node:assert/strict";
import test from "node:test";

import { MIXPANEL_EVENT_NAMES, MIXPANEL_SCROLL_DEPTHS, attributionProperties, comicSlugFromPath, mixpanelTrackRequestBody, pageTrackingProperties, pageTypeFromPath } from "../lib/mixpanel-events.js";

test("Mixpanel event taxonomy covers core site activity", () => {
  assert.deepEqual(MIXPANEL_SCROLL_DEPTHS, [25, 50, 75, 90]);
  assert.ok(MIXPANEL_EVENT_NAMES.includes("page_viewed"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("comic_pdf_clicked"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("reader_setting_changed"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("newsletter_form_submitted"));
  assert.ok(MIXPANEL_EVENT_NAMES.includes("support_zec_copied"));
});

test("pageTypeFromPath classifies public routes", () => {
  assert.equal(pageTypeFromPath("/"), "home");
  assert.equal(pageTypeFromPath("/about/"), "about");
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

  const parsed = JSON.parse(body);
  assert.ok(Array.isArray(parsed));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].event, "page_viewed");
  assert.equal(parsed[0].properties.token, "test-token");
});
