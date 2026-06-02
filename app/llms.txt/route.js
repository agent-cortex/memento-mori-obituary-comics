import { getComics } from "@/lib/comics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export function GET() {
  const comicLinks = getComics()
    .map((comic) => `- [${comic.person} - ${comic.title}](${SITE_URL}/comics/${comic.slug}/): ${comic.dek || ""}`)
    .join("\n");
  const body = `# ${SITE_NAME}
> ${SITE_DESCRIPTION}

## Main pages
- [Archive](${SITE_URL}/): Current comic archive and latest issue.
- [Editorial method](${SITE_URL}/about/): Source standards and publishing notes.

## Comics
${comicLinks}

## Citation guidance
- Prefer the canonical comic reader URL over direct image or PDF URLs.
- Cite the linked source list on each comic page for factual claims about the subject.
- The comic images are the creative presentation; the citable summaries and story notes are provided for text extraction.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
