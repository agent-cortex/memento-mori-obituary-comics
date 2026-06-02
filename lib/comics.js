import { createRequire } from "node:module";

import { absoluteUrl, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const require = createRequire(import.meta.url);
const rawComics = require("../comics.json");

export const comics = rawComics;

export function getComics() {
  return comics;
}

export function getLatestComic() {
  return comics[0] || null;
}

export function getComic(slug) {
  return comics.find((comic) => comic.slug === slug) || null;
}

export function getNextComic(slug) {
  if (comics.length < 2) return null;
  const index = comics.findIndex((comic) => comic.slug === slug);
  if (index === -1) return comics[0];
  return comics[(index + 1) % comics.length];
}

export function comicPath(comic) {
  return `/comics/${comic.slug}/`;
}

export function comicUrl(comic) {
  return absoluteUrl(comicPath(comic));
}

export function mediaPath(comic, src = "") {
  return `/comics/${comic.slug}/${src}`.replace(/\/+$/, "/");
}

export function firstImagePath(comic) {
  const first = comic?.pages?.[0];
  return first ? mediaPath(comic, first) : "";
}

export function firstImageUrl(comic) {
  const path = firstImagePath(comic);
  return path ? absoluteUrl(path) : "";
}

export function imageSize(comic, src) {
  const value = comic?.page_dimensions?.[src];
  return Array.isArray(value) && value.length === 2 ? { width: value[0], height: value[1] } : {};
}

export function sourceItems(comic) {
  return (comic.sources || [])
    .map((source) => {
      if (typeof source === "string") return { name: source, url: "" };
      return { name: source.name || "", url: source.url || "" };
    })
    .filter((source) => source.name);
}

export function sourceNames(comic) {
  return sourceItems(comic).map((source) => source.name).join("; ");
}

export function compactText(value, limit) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 3)).replace(/[ ,;.]+$/, "")}...`;
}

export function parseYears(years = "") {
  const values = String(years).match(/\d{4}/g) || [];
  return { birthDate: values[0] || "", deathDate: values[1] || "" };
}

export function comicDescription(comic) {
  const dek = (comic.dek || "").replace(/\.$/, "");
  const event = (comic.mortality_event || "").replace(/\.$/, "");
  return event ? `${dek}. A memento mori obituary comic centered on ${event}.` : `${dek}. A memento mori obituary comic.`;
}

export function citableSummary(comic) {
  if (comic.citable_summary?.length) return comic.citable_summary;
  return [
    `${comic.person} (${comic.years || ""}) is featured in an obituary comic about mortality, work, and what remains.`,
    comic.mortality_event ? `The comic centers on this mortality event: ${comic.mortality_event}` : comic.dek,
    `The reader version includes image pages, a PDF, and sources including ${sourceNames(comic)}.`,
  ];
}

export function storyNotes(comic) {
  if (comic.story_notes?.length) return comic.story_notes;
  return [
    `This comic follows ${comic.person}, ${(comic.dek || "").replace(/\.$/, "")}.`,
    comic.mortality_event
      ? `The story turns on ${comic.mortality_event.replace(/\.$/, "")}, treating that encounter with death as the pressure point for the work that followed.`
      : "",
    `The source trail for this page includes ${sourceNames(comic)}.`,
  ].filter(Boolean);
}

export function pageSummary(comic, index) {
  return comic.page_summaries?.[index - 1] || "";
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        publisher: publisherSchema(),
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#collection`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary comic archive",
          itemListElement: comics.map((comic, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: comicUrl(comic),
            name: `${comic.person} - ${comic.title}`,
          })),
        },
      },
    ],
  };
}

export function comicSchema(comic) {
  const { birthDate, deathDate } = parseYears(comic.years);
  const subject = {
    "@type": "Person",
    name: comic.person,
    description: comic.dek || "",
    ...(birthDate ? { birthDate } : {}),
    ...(deathDate ? { deathDate } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${comicUrl(comic)}#creative-work`,
        name: `${comic.person} - ${comic.title}`,
        headline: `${comic.person} Obituary Comic - ${comic.title}`,
        description: comic.dek || "",
        url: comicUrl(comic),
        image: firstImageUrl(comic),
        datePublished: comic.published_at || "",
        publisher: publisherSchema(),
        about: subject,
        citation: sourceItems(comic).map((source) => source.url).filter(Boolean),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${comicUrl(comic)}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: comic.person, item: comicUrl(comic) },
        ],
      },
    ],
  };
}

function publisherSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  };
}
