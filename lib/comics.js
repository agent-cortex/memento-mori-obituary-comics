import { createRequire } from "node:module";

import {
  absoluteUrl,
  publisherSchema,
  SITE_CATEGORY,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
} from "./site.js";
import { comicMediaPath } from "./media-paths.js";

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
  return comicMediaPath(comic, src);
}

export function firstImagePath(comic) {
  const first = comic?.pages?.[0];
  return first ? mediaPath(comic, first) : "";
}

export function firstImageUrl(comic) {
  const path = firstImagePath(comic);
  return path ? absoluteUrl(path) : "";
}

export function comicImageMetadata(comic) {
  const image = comic?.pages?.[0] || "";
  const url = firstImageUrl(comic);
  if (!url) return [];
  const size = imageSize(comic, image);
  return [
    {
      url,
      ...(size.width ? { width: size.width } : {}),
      ...(size.height ? { height: size.height } : {}),
      alt: `${comic.person} obituary comic cover for ${comic.title}`,
    },
  ];
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

export function sourceUrls(comic) {
  return sourceItems(comic).map((source) => source.url).filter(Boolean);
}

export function comicKeywords(comic) {
  return [
    `${comic.person} obituary comic`,
    `${comic.person} biography comic`,
    `${comic.person} memento mori`,
    comic.title,
    comic.mortality_event,
    ...SITE_KEYWORDS,
  ]
    .filter(Boolean)
    .map((keyword) => String(keyword).trim())
    .filter(Boolean);
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
  const latest = getLatestComic();
  const latestDate = latest?.published_at || "";
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#collection`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        genre: SITE_CATEGORY,
        ...(latestDate ? { dateModified: latestDate } : {}),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
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
  const sources = sourceItems(comic);
  const pageUrl = comicUrl(comic);
  const imageUrl = firstImageUrl(comic);
  const keywords = comicKeywords(comic);
  const subject = {
    "@type": "Person",
    "@id": `${pageUrl}#subject`,
    name: comic.person,
    description: comic.dek || "",
    ...(birthDate ? { birthDate } : {}),
    ...(deathDate ? { deathDate } : {}),
    ...(sources.length
      ? {
          subjectOf: sources.map((source) => ({
            "@type": "CreativeWork",
            name: source.name,
            ...(source.url ? { url: source.url } : {}),
          })),
        }
      : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${comic.person} Obituary Comic - ${comic.title}`,
        description: comicDescription(comic),
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${pageUrl}#subject` },
        ...(imageUrl ? { primaryImageOfPage: { "@id": `${pageUrl}#primary-image` } } : {}),
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": ["CreativeWork", "ComicStory"],
        "@id": `${comicUrl(comic)}#creative-work`,
        name: `${comic.person} - ${comic.title}`,
        headline: `${comic.person} Obituary Comic - ${comic.title}`,
        description: comicDescription(comic),
        url: pageUrl,
        inLanguage: SITE_LANGUAGE,
        isAccessibleForFree: true,
        keywords,
        image: imageUrl,
        datePublished: comic.published_at || "",
        dateModified: comic.updated_at || comic.published_at || "",
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${pageUrl}#subject` },
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        ...(sourceUrls(comic).length ? { citation: sourceUrls(comic) } : {}),
        ...(comic.pdf
          ? {
              encoding: {
                "@type": "MediaObject",
                encodingFormat: "application/pdf",
                contentUrl: absoluteUrl(mediaPath(comic, comic.pdf)),
              },
            }
          : {}),
        hasPart: (comic.pages || []).map((src, index) => ({
          "@type": "ImageObject",
          "@id": `${pageUrl}#page-${index + 1}`,
          contentUrl: absoluteUrl(mediaPath(comic, src)),
          caption: pageSummary(comic, index + 1) || `Page ${index + 1} of ${comic.person}: ${comic.title}`,
        })),
      },
      ...(imageUrl
        ? [
            {
              "@type": "ImageObject",
              "@id": `${pageUrl}#primary-image`,
              contentUrl: imageUrl,
              caption: `${comic.person} obituary comic cover for ${comic.title}`,
            },
          ]
        : []),
      subject,
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#summary`,
        name: `${comic.person} citable summary`,
        itemListElement: citableSummary(comic).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: comic.person, item: pageUrl },
        ],
      },
    ],
  };
}
