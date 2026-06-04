export const MIXPANEL_SCROLL_DEPTHS = [25, 50, 75, 90];

export const MIXPANEL_EVENT_NAMES = [
  "page_viewed",
  "scroll_depth_reached",
  "link_clicked",
  "button_clicked",
  "external_link_clicked",
  "comic_pdf_clicked",
  "comic_share_clicked",
  "comic_reader_loaded",
  "reader_setting_changed",
  "reader_slide_changed",
  "reader_fullscreen_requested",
  "newsletter_dialog_opened",
  "newsletter_form_submitted",
  "newsletter_form_validation_failed",
  "support_dialog_opened",
  "support_zec_copied",
];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function mixpanelTrackRequestBody(payload) {
  const body = new URLSearchParams();
  body.set("data", JSON.stringify([payload]));
  return body.toString();
}

export function comicSlugFromPath(pathname = "") {
  const match = pathname.match(/^\/comics\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function pageTypeFromPath(pathname = "/") {
  const cleanPath = (pathname.split(/[?#]/)[0] || "/").replace(/\/+$/, "") || "/";

  if (cleanPath === "/") return "home";
  if (cleanPath === "/obituary-stories") return "obituary_stories";
  if (cleanPath === "/about") return "about";
  if (cleanPath === "/press") return "press";
  if (cleanPath === "/newsletter") return "newsletter";
  if (cleanPath === "/llms.txt") return "llms";
  if (cleanPath.startsWith("/comics/")) return "comic_reader";
  if (cleanPath.startsWith("/media/comics/")) return "comic_media";
  if (cleanPath.startsWith("/api/latest-pdf")) return "latest_pdf_api";

  return "other";
}

export function attributionProperties(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const properties = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) properties[key] = value;
  }

  return properties;
}

export function pageTrackingProperties(pathname = "/", search = "") {
  return {
    page_type: pageTypeFromPath(pathname),
    comic_slug: comicSlugFromPath(pathname),
    ...attributionProperties(search),
  };
}
