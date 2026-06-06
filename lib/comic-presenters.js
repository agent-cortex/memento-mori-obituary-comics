import { comicMediaPath } from "./media-paths.js";

export function mediaPath(comic, src = "") {
  return comicMediaPath(comic, src);
}

export function firstImagePath(comic) {
  const first = comic?.pages?.[0];
  return first ? mediaPath(comic, first) : "";
}

export function imageSize(comic, src) {
  const value = comic?.page_dimensions?.[src];
  return Array.isArray(value) && value.length === 2 ? { width: value[0], height: value[1] } : {};
}

function splitSourceLabelAndUrl(name = "", url = "") {
  const rawName = String(name || "").trim();
  const rawUrl = String(url || "").trim();
  const embeddedUrlMatch = rawName.match(/(https?:\/\/\S+)/i);

  if (embeddedUrlMatch) {
    const embeddedUrl = embeddedUrlMatch[1].replace(/[),.;]+$/, "");
    const label = rawName
      .slice(0, embeddedUrlMatch.index)
      .replace(/[:\-–\s]+$/, "")
      .trim();

    return {
      name: label || rawUrl || embeddedUrl,
      url: rawUrl || embeddedUrl,
    };
  }

  return {
    name: rawName || rawUrl,
    url: rawUrl,
  };
}

export function sourceItems(comic) {
  return (comic.sources || [])
    .map((source) => {
      if (typeof source === "string") return splitSourceLabelAndUrl(source, "");
      return splitSourceLabelAndUrl(source.name || "", source.url || "");
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
