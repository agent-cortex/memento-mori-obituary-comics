import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A life story obituary template for writing a warmer obituary: short, full-length, family-history, and visual obituary structures with privacy and source checks.";

const templates = [
  {
    title: "Short life story obituary template",
    bestFor: "Newspaper notices, funeral-home websites, and social posts that need one human detail.",
    lines: [
      "[Full name], [age], of [place], died on [date].",
      "Born in [place] to [parents or family context], [first name] built a life around [family, work, service, faith, craft, community, or care].",
      "They will be remembered for [specific habit, object, place, phrase, action, or relationship], a detail that showed [quality] in daily life.",
      "[First name] is survived by [family wording] and was preceded in death by [optional family wording].",
      "A [service, memorial, celebration of life, or private gathering] will be held at [details].",
    ],
  },
  {
    title: "Full-length life story obituary template",
    bestFor: "Online obituaries, memorial pages, family-history notes, and tributes with room for a shaped story.",
    lines: [
      "Opening: [Full name], known as [preferred name], died on [date] at [age]. Name one role, value, or relationship that readers should understand first.",
      "Life path: Give the verified places, family, education, work, service, faith, migration, or community frame that shaped the life.",
      "Defining scene: Add one concrete story, object, room, phrase, recipe, route, tool, photograph, or habit that shows the person in action.",
      "People: Name surviving and predeceased family in the style required by the publication, then add friends, colleagues, neighbors, students, or caregivers when appropriate.",
      "Legacy and details: Close with service information, donation preferences, privacy-sensitive omissions, and one clean sentence about what remains.",
    ],
  },
  {
    title: "Family-history obituary template",
    bestFor: "Genealogy posts, family newsletters, ancestor notes, and record-led life stories.",
    lines: [
      "Record anchor: [Full name] was born [date] in [place] and died [date] in [place], according to [record, obituary, newspaper, family document, or source].",
      "Family frame: Name parents, spouses, children, siblings, or household context only where the facts are verified or clearly marked as family memory.",
      "Movement through time: Track one meaningful route: migration, work, service, school, faith community, homestead, neighborhood, or craft.",
      "Remembered detail: Add the family scene that records cannot show: a phrase, room, tool, photograph, recipe, route, or repeated kindness.",
      "Citation note: Keep source names, dates, links, and uncertainties with the draft so future readers can separate evidence from interpretation.",
    ],
  },
  {
    title: "Visual obituary template",
    bestFor: "Comics, illustrated tributes, classroom projects, memorial slides, and visual biography drafts.",
    lines: [
      "Panel or section one: State the verified death notice fact without decoration.",
      "Panel or section two: Show the pressure point: illness, exile, work, loss, migration, invention, act of care, or public test.",
      "Panel or section three: Show the person choosing, making, helping, enduring, protecting, teaching, or changing something.",
      "Panel or section four: Name what remains and cite the source trail that supports the story.",
    ],
  },
];

const checks = [
  {
    title: "Keep",
    items: [
      "Full name, date, place, service details, and relationship wording that have been checked.",
      "One specific scene or object that makes the person recognizable.",
      "Source notes for facts that future family members or editors may need to verify.",
    ],
  },
  {
    title: "Cut",
    items: [
      "Generic praise that could describe anyone.",
      "Medical, address, financial, family-conflict, or cause-of-death details that do not serve the public story.",
      "Claims about awards, service, education, or work history that nobody has verified.",
    ],
  },
  {
    title: "Move private",
    items: [
      "Sensitive family context that belongs in a private family document.",
      "Unresolved memories that should be discussed before publication.",
      "Photos or stories that need consent from living people.",
    ],
  },
];

const referenceLinks = [
  {
    label: "Legacy obituary templates",
    href: "https://www.legacy.com/memorial-writing/obituary-templates/",
    note: "Template examples for short and life-story obituary structures.",
  },
  {
    label: "ObituaryGuide template",
    href: "https://www.obituaryguide.com/template.php",
    note: "Outline-style obituary template and sample format.",
  },
  {
    label: "FuneralFolio obituary templates",
    href: "https://www.funeralfolio.com/obituary-template",
    note: "Free obituary templates including a life story obituary template.",
  },
  {
    label: "WV Funeral Board obituary guide",
    href: "https://wvfuneralboard.com/guides/obituary-writing-guide",
    note: "Obituary writing guide with template formats and publication context.",
  },
  {
    label: "Evaheld life story obituary guide",
    href: "https://evaheldmemorials.com/blog/how-to-write-a-life-story-obituary-templates-examples/",
    note: "Life story obituary structure, examples, editing prompts, and privacy checks.",
  },
  {
    label: "Bateman-Allen obituary resource",
    href: "https://www.batemanallenfuneralhome.com/resources/write-an-obituary/",
    note: "Funeral-home obituary-writing resource with a template section.",
  },
];

export const metadata = {
  title: "Life Story Obituary Template",
  description,
  keywords: [
    "life story obituary template",
    "obituary story template",
    "obituary template",
    "life story obituary",
    "visual obituary template",
    "family history obituary template",
    "source-backed obituary template",
  ],
  alternates: {
    canonical: "/life-story-obituary-template/",
  },
  openGraph: {
    type: "article",
    title: `Life Story Obituary Template | ${SITE_NAME}`,
    description,
    url: "/life-story-obituary-template/",
  },
  twitter: {
    title: `Life Story Obituary Template | ${SITE_NAME}`,
    description,
  },
};

export default function LifeStoryObituaryTemplatePage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-04");
  const featured = comics.slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": ["Article", "CreativeWork"],
        "@id": `${SITE_URL}/life-story-obituary-template/#article`,
        headline: "Life Story Obituary Template",
        name: "Life Story Obituary Template",
        url: absoluteUrl("/life-story-obituary-template/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-04",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/life-story-obituary-template/#webpage` },
        about: ["life story obituary template", "obituary template", "obituary writing", "visual obituaries"],
        mainEntity: {
          "@type": "ItemList",
          name: "Life story obituary template types",
          itemListElement: templates.map((template, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: template.title,
            description: template.bestFor,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/life-story-obituary-template/#webpage`,
        name: "Life Story Obituary Template",
        url: absoluteUrl("/life-story-obituary-template/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section about-page explainer-page template-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary template</div>
            <h1>Life Story Obituary Template</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/obituary-writing-prompts/">Writing prompts</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-story-worksheet/">Printable worksheet</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Obituary examples</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="template-purpose">
            <h2 id="template-purpose">What This Template Does</h2>
            <p>
              A life story obituary template gives structure without flattening the person into a form. Use it after collecting the public facts, then add one specific scene, object, relationship, or source-backed detail that makes the life recognizable.
            </p>
            <p>
              If you only need a basic death notice, keep the obituary short. If you have room online, use the fuller template and bring in the story material from the <Link href="/obituary-writing-prompts/">obituary writing prompts</Link> and <Link href="/obituary-story-worksheet/">worksheet</Link>.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="templates">
            <div>
              <div className="kicker">Copy and adapt</div>
              <h2 id="templates">Obituary Story Templates</h2>
            </div>
            <div className="worksheet-fields">
              {templates.map((template) => (
                <section className="worksheet-box" key={template.title}>
                  <h3>{template.title}</h3>
                  <p>{template.bestFor}</p>
                  <ol className="writing-guide-list">
                    {template.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="editing-check">
            <div>
              <div className="kicker">Before publishing</div>
              <h2 id="editing-check">Keep, Cut, Move Private</h2>
            </div>
            <div className="stories-intent-list">
              {checks.map((check) => (
                <article key={check.title}>
                  <h3>{check.title}</h3>
                  <ul>
                    {check.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="source-backed-examples">
            <h2 id="source-backed-examples">Source-Backed Template Examples</h2>
            <p>
              The finished reader pages below show how a template becomes a story when it includes a verified fact, a life-shaping pressure point, a visual detail, and a source trail.
            </p>
            <ul className="press-subject-list">
              {featured.map((comic) => {
                const sources = sourceItems(comic)
                  .map((source) => source.name)
                  .slice(0, 3)
                  .join(", ");
                return (
                  <li key={comic.slug}>
                    <Link href={comicPath(comic)}>{comic.person}: {comic.title}</Link>
                    <p>{comic.dek}</p>
                    <span>{comic.published_at || "Undated"} - Sources: {sources || "listed on the reader page"}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">Further reference</div>
              <h2 id="references">Template And Writing Resources</h2>
            </div>
            <div className="press-link-list prompts-reference-list">
              {referenceLinks.map((reference) => (
                <a className="press-link-card" href={reference.href} key={reference.href} rel="noreferrer" target="_blank">
                  <span>{reference.label}</span>
                  <strong>{reference.href}</strong>
                  <em>{reference.note}</em>
                </a>
              ))}
            </div>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Template Pages</h2>
              <p>
                Use this page for obituary template roundups, funeral-home writing resources, family-history forms, memorial program resources, and classroom writing assignments that need a story-focused template. For question banks, use the <Link href="/obituary-writing-prompts/">obituary writing prompts page</Link>.
              </p>
            </div>
            <Link href="/life-story-obituary-template/">{absoluteUrl("/life-story-obituary-template/")}</Link>
          </section>
        </article>
      </main>
      <footer>
        Obituary templates for sourced life stories. <Link href="/about/">Read the editorial method</Link>.
      </footer>
    </>
  );
}
