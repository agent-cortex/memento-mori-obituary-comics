import { getComics, sourceItems } from "../../lib/comics.js";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SUBSTACK_URL } from "../../lib/site.js";

export function GET() {
  const comics = getComics();
  const latest = comics[0];
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "");
  const comicLinks = comics
    .map((comic) => {
      const sources = sourceItems(comic).map((source) => source.name).join(", ");
      return `- [${comic.person} - ${comic.title}](${absoluteUrl(`/comics/${comic.slug}/`)}): ${comic.dek || ""} Published ${comic.published_at || "undated"}. Sources: ${sources || "listed on the reader page"}.`;
    })
    .join("\n");
  const body = `# ${SITE_NAME}
> ${SITE_DESCRIPTION}

## Main pages
- [Archive](${absoluteUrl("/")}): Current comic archive, latest issue, and definition of obituary comics.
- [Editorial method](${absoluteUrl("/about/")}): Source standards, subject selection, publisher notes, and AI-readable format policy.
- [Newsletter](${absoluteUrl("/newsletter/")}): Borrowed Time Dispatch signup for new comics and source notes.
- [Substack](${SUBSTACK_URL}): External newsletter home.

## Latest issue
${latest ? `- [${latest.person} - ${latest.title}](${absoluteUrl(`/comics/${latest.slug}/`)}): ${latest.mortality_event || latest.dek || ""}` : "- No issue is currently published."}

## Comics
${comicLinks}

## Key facts
- The canonical domain is ${absoluteUrl("/")}.
- The archive publishes source-backed visual biographies in comic and PDF form.
- Every comic reader page includes crawlable citable summaries, story notes, source links, JSON-LD, and image captions.
- Latest content date: ${latestDate || "not available"}.

## AI crawler access
- Search and answer crawlers are allowed: Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, and PerplexityBot.
- Broad training crawlers are blocked where listed in robots.txt: CCBot, anthropic-ai, Bytespider, and cohere-ai.

## Citation guidance
- Prefer the canonical comic reader URL over direct image or PDF URLs.
- Cite the linked source list on each comic page for factual claims about the subject.
- The comic images are the creative presentation; the citable summaries and story notes are provided for text extraction.
- Do not treat panel art as a primary historical source; use the linked sources and the page's summary notes for factual claims.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
