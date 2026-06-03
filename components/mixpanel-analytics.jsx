"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { MIXPANEL_SCROLL_DEPTHS, comicSlugFromPath, mixpanelTrackRequestBody, pageTrackingProperties } from "@/lib/mixpanel-events";
import { SITE_NAME } from "@/lib/site";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN?.trim() || "";
const MIXPANEL_API_HOST = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST?.trim() || "https://api-eu.mixpanel.com";
const MIXPANEL_DEBUG = process.env.NEXT_PUBLIC_MIXPANEL_DEBUG === "true";
const TRACK_EVENT = "finalnotes:track";
const DISTINCT_ID_KEY = "finalnotes_mixpanel_distinct_id";
const SESSION_ID_KEY = "finalnotes_mixpanel_session_id";
const SESSION_STARTED_KEY = "finalnotes_mixpanel_session_started_at";
const TRACK_QUEUE_KEY = "__finalNotesTrackQueue";
const TRACK_READY_KEY = "__finalNotesTrackReady";

export function trackActivity(event, properties = {}) {
  if (typeof window === "undefined" || !event) return;
  const detail = { event, properties };
  if (!window[TRACK_READY_KEY]) {
    window[TRACK_QUEUE_KEY] = window[TRACK_QUEUE_KEY] || [];
    window[TRACK_QUEUE_KEY].push(detail);
    return;
  }
  window.dispatchEvent(new CustomEvent(TRACK_EVENT, { detail }));
}

export function MixpanelAnalytics() {
  const pathname = usePathname() || "/";
  const trackerRef = useRef(null);
  const lastPageKeyRef = useRef("");
  const reachedDepthsRef = useRef(new Set());

  useEffect(() => {
    if (!MIXPANEL_TOKEN) return undefined;

    trackerRef.current = createBrowserTracker();

    function track(event, properties = {}) {
      trackerRef.current?.track(event, properties);
    }

    function onCustomEvent(event) {
      const detail = event.detail || {};
      if (!detail.event) return;
      track(detail.event, detail.properties || {});
    }

    function onClick(event) {
      const element = event.target instanceof Element ? event.target.closest("a, button, [role='button'], summary") : null;
      if (!element) return;

      const anchor = element.closest("a");
      const configuredEvent = element.closest("[data-analytics-event]")?.getAttribute("data-analytics-event");
      const properties = elementTrackingProperties(element, anchor);

      if (configuredEvent) track(configuredEvent, properties);

      if (anchor) {
        track("link_clicked", properties);
        if (properties.is_external) track("external_link_clicked", properties);
        if (properties.is_pdf) track("comic_pdf_clicked", properties);
        return;
      }

      track("button_clicked", properties);
    }

    window.addEventListener(TRACK_EVENT, onCustomEvent);
    window[TRACK_READY_KEY] = true;

    for (const detail of window[TRACK_QUEUE_KEY] || []) {
      if (detail.event) track(detail.event, detail.properties || {});
    }
    window[TRACK_QUEUE_KEY] = [];

    document.addEventListener("click", onClick, { capture: true });

    return () => {
      window[TRACK_READY_KEY] = false;
      window.removeEventListener(TRACK_EVENT, onCustomEvent);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!MIXPANEL_TOKEN || !trackerRef.current) return;

    const search = window.location.search || "";
    const pageKey = `${pathname}${search}`;
    if (lastPageKeyRef.current === pageKey) return;

    lastPageKeyRef.current = pageKey;
    reachedDepthsRef.current = new Set();

    trackerRef.current.track("page_viewed", {
      ...pageTrackingProperties(pathname, search),
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    if (!MIXPANEL_TOKEN || !trackerRef.current) return undefined;

    function onScroll() {
      const documentElement = document.documentElement;
      const scrollHeight = Math.max(documentElement.scrollHeight, document.body.scrollHeight);
      const viewportBottom = window.scrollY + window.innerHeight;
      const depth = scrollHeight <= 0 ? 100 : Math.min(100, Math.round((viewportBottom / scrollHeight) * 100));

      for (const checkpoint of MIXPANEL_SCROLL_DEPTHS) {
        if (depth < checkpoint || reachedDepthsRef.current.has(checkpoint)) continue;
        reachedDepthsRef.current.add(checkpoint);
        trackerRef.current.track("scroll_depth_reached", {
          ...pageTrackingProperties(window.location.pathname, window.location.search),
          depth_percent: checkpoint,
        });
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}

function createBrowserTracker() {
  const apiHost = MIXPANEL_API_HOST.replace(/\/+$/, "");
  const distinctId = getStoredId(localStorage, DISTINCT_ID_KEY);
  const sessionId = getStoredId(sessionStorage, SESSION_ID_KEY);
  const sessionStartedAt = getSessionStartedAt();

  return {
    track(event, properties = {}) {
      const payload = {
        event,
        properties: {
          token: MIXPANEL_TOKEN,
          distinct_id: distinctId,
          time: Math.floor(Date.now() / 1000),
          $insert_id: `${sessionId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          ...browserContextProperties(sessionId, sessionStartedAt),
          ...properties,
        },
      };

      const body = mixpanelTrackRequestBody(payload);
      const url = `${apiHost}/track?ip=1`;

      if (navigator.sendBeacon) {
        const sent = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
        if (sent) return;
      }

      fetch(url, {
        method: "POST",
        mode: "cors",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body,
      }).catch((error) => {
        if (MIXPANEL_DEBUG) console.warn("Mixpanel tracking failed", error);
      });
    },
  };
}

function browserContextProperties(sessionId, sessionStartedAt) {
  const location = window.location;
  const referrer = document.referrer || "";
  const referrerUrl = safeUrl(referrer);

  return {
    site_name: SITE_NAME,
    site_domain: location.hostname,
    session_id: sessionId,
    session_started_at: sessionStartedAt,
    page_title: document.title,
    page_type: pageTrackingProperties(location.pathname, location.search).page_type,
    comic_slug: comicSlugFromPath(location.pathname),
    $current_url: location.href,
    $pathname: location.pathname,
    $referrer: referrer,
    $referring_domain: referrerUrl?.hostname || "",
    browser_language: navigator.language,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen?.width,
    screen_height: window.screen?.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function elementTrackingProperties(element, anchor) {
  const href = anchor?.getAttribute("href") || "";
  const destination = href ? safeUrl(href, window.location.origin) : null;
  const pathname = destination?.pathname || window.location.pathname;

  return {
    ...pageTrackingProperties(window.location.pathname, window.location.search),
    surface: surfaceForElement(element),
    element_text: readableElementText(element),
    element_role: element.getAttribute("role") || element.tagName.toLowerCase(),
    href,
    destination_url: destination?.href || "",
    destination_domain: destination?.hostname || "",
    destination_path: pathname,
    is_external: Boolean(destination && destination.hostname !== window.location.hostname),
    is_pdf: pathname.toLowerCase().endsWith(".pdf"),
    comic_slug: element.closest("[data-comic-slug]")?.getAttribute("data-comic-slug") || comicSlugFromPath(pathname) || comicSlugFromPath(window.location.pathname),
  };
}

function surfaceForElement(element) {
  const surfaces = [
    [".site-nav", "site_nav"],
    [".home-hero", "home_hero"],
    [".latest-panel", "latest_panel"],
    [".archive-card", "archive_card"],
    [".reader-toolbar", "reader_toolbar"],
    [".reader-pages", "reader_pages"],
    [".reader-footer", "reader_footer"],
    [".newsletter-form", "newsletter_form"],
    [".support-dialog", "support_dialog"],
    [".ritual-section", "ritual_tools"],
  ];

  for (const [selector, surface] of surfaces) {
    if (element.closest(selector)) return surface;
  }

  return "page";
}

function readableElementText(element) {
  return (element.getAttribute("aria-label") || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function safeUrl(value, base) {
  if (!value) return null;
  try {
    return new URL(value, base);
  } catch (_error) {
    return null;
  }
}

function getStoredId(storage, key) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const created = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    storage.setItem(key, created);
    return created;
  } catch (_error) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getSessionStartedAt() {
  try {
    const existing = sessionStorage.getItem(SESSION_STARTED_KEY);
    if (existing) return existing;
    const created = new Date().toISOString();
    sessionStorage.setItem(SESSION_STARTED_KEY, created);
    return created;
  } catch (_error) {
    return new Date().toISOString();
  }
}
