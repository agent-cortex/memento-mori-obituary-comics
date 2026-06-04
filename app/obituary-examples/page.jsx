import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Obituary examples that show how a death notice can become a sourced life story, with visual obituary examples, article structures, and writing notes.";

const examplePatterns = [
  {
    title: "The defining pressure point",
    text: "Use one illness, exile, loss, public test, journey, or decision as the hinge that helps readers understand the life.",
  },
  {
    title: "The remembered object",
    text: "Let a tool, room, photograph, recipe, notebook, route, uniform, or artwork carry details that would otherwise become generic praise.",
  },
  {
    title: "The record-led profile",
    text: "Start with verified names, dates, places, and source links, then add memory and interpretation only where the evidence supports it.",
  },
  {
    title: "The legacy sentence",
    text: "Close by naming what remains: people taught, work left behind, habits passed on, records preserved, care given, or stories still told.",
  },
];

const obituaryExampleFrames = [
  {
    title: "Short obituary story example",
    text: "[Name], [age], died on [date] in [place]. Across [work, family, service, art, or community], they were remembered for one concrete thing: [specific action, habit, object, or scene]. That detail says more than a list of adjectives because it shows how they moved through the world.",
  },
  {
    title: "Family-history obituary example",
    text: "The public record gives the dates; the family story gives the room. [Name] was born in [place] in [year], worked/lived/served in [context], and left behind a trace that descendants can still follow: [letter, photograph, clipping, route, recipe, tool, or phrase].",
  },
  {
    title: "Visual obituary example",
    text: "Panel one states the verified fact. Panel two shows the pressure point. Panel three shows the person acting, choosing, caring, making, or enduring. Panel four names what survives the death.",
  },
];

export const metadata = {
  title: "Obituary Examples and Story Patterns",
  description,
  keywords: [
    "obituary examples",
    "obituary story examples",
    "obituary article examples",
    "visual obituary examples",
    "life story obituary examples",
    "sample obituary story",
  ],
  alternates: {
    canonical: "/obituary-examples/",
  },
  openGraph: {
    type: "article",
    title: `Obituary Examples and Story Patterns | ${SITE_NAME}`,
    description,
    url: "/obituary-examples/",
  },
  twitter: {
    title: `Obituary Examples and Story Patterns | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryExamplesPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-04");
  const featured = comics.slice(0, 6);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-examples/#article`,
        headline: "Obituary Examples and Story Patterns",
        name: "Obituary Examples and Story Patterns",
        url: absoluteUrl("/obituary-examples/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-04",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-examples/#webpage` },
        about: ["obituary examples", "obituary stories", "obituary writing", "visual obituaries"],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/obituary-examples/#collection`,
        name: "Obituary Examples",
        url: absoluteUrl("/obituary-examples/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          name: "Source-backed obituary story examples",
          itemListElement: featured.map((comic, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(comicPath(comic)),
            name: `${comic.person} - ${comic.title}`,
            description: comic.dek || comic.mortality_event || "",
          })),
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-examples/#webpage`,
        name: "Obituary Examples and Story Patterns",
        url: absoluteUrl("/obituary-examples/"),
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
      <main className="wrap section about-page explainer-page examples-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary examples</div>
            <h1>Obituary Examples</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/obituary-stories/">Read source-backed stories</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-articles/">Article guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-lesson-plan/">Lesson plan</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-research-guide/">Research guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-writing-prompts/">Writing prompts</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/short-obituary-examples/">Short examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-wording/">Wording</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-story-worksheet/">Printable worksheet</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-mistakes-to-avoid/">Mistakes to avoid</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="what-these-examples-show">
            <h2 id="what-these-examples-show">What These Examples Show</h2>
            <p>
              Most obituary examples teach the basic order: announcement, biography, family, service details, and donations. These examples focus on the story layer: the scene, pressure point, source trail, and visual detail that make an obituary feel specific without losing accuracy.
            </p>
            <p>
              Use this page when you need examples of obituary articles, visual obituaries, or life-story obituary structures. If you are writing for a newspaper or funeral-home form, start with the required facts in the <Link href="/obituary-checklist/">obituary checklist</Link>, choose a <Link href="/short-obituary-examples/">short obituary example</Link> if print space is limited, run the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>, check the <Link href="/obituary-cost/">obituary cost guide</Link>, then use one of these patterns to make the life recognizable.
            </p>
          </section>

          <section className="explainer-principles examples-patterns" aria-labelledby="example-patterns">
            <div>
              <div className="kicker">Patterns</div>
              <h2 id="example-patterns">Four Obituary Example Patterns</h2>
            </div>
            <div className="stories-intent-list">
              {examplePatterns.map((pattern) => (
                <article key={pattern.title}>
                  <h3>{pattern.title}</h3>
                  <p>{pattern.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="sample-frames">
            <h2 id="sample-frames">Sample Obituary Story Frames</h2>
            <p>
              These are not fill-in-the-blank funeral notices. They are starting frames for the narrative part of an obituary, memorial article, family-history note, or visual obituary.
            </p>
            <div className="examples-frame-list">
              {obituaryExampleFrames.map((frame) => (
                <article key={frame.title} className="worksheet-box">
                  <h3>{frame.title}</h3>
                  <p>{frame.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-next" aria-labelledby="source-backed-examples">
            <div>
              <div className="kicker">Archive examples</div>
              <h2 id="source-backed-examples">Source-Backed Obituary Article Examples</h2>
            </div>
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
                    <span>{comic.published_at || "Undated"} - {comic.mortality_event || "Visual obituary"} - Sources: {sources || "listed on the reader page"}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Example Pages</h2>
              <p>
                Use this page for obituary example roundups, writing classes, funeral-home planning pages, and genealogy posts that need examples beyond a template. For short newspaper notices, simple obituary examples, and brief death announcements, use the <Link href="/short-obituary-examples/">short obituary examples</Link>. For phrase banks, survived-by wording, preceded-in-death wording, service wording, and death announcement language, use the <Link href="/obituary-wording/">obituary wording examples</Link>. For general information-gathering resources, use the <Link href="/obituary-checklist/">obituary checklist</Link>. For common mistakes and proofing errors, use the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>. For obituary cost, print length, photo-fee, and short-notice decisions, use the <Link href="/obituary-cost/">obituary cost guide</Link>. For memorial donation and in-lieu-of-flowers examples, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For obituary privacy and scam-safety resources, use the <Link href="/what-not-to-include-in-an-obituary/">what not to include in an obituary checklist</Link>. For fake obituary examples, copied notices, and obituary piracy checks, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For genealogy search and obituary-record research links, use the <Link href="/obituary-research-guide/">obituary research guide</Link>. For journalism lessons and feature-obituary resources, use the <Link href="/obituary-articles/">obituary articles page</Link>. For classroom steps and assessment prompts, use the <Link href="/obituary-lesson-plan/">obituary lesson plan</Link>. For template roundups, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For interview questions and prompt lists, use the <Link href="/obituary-writing-prompts/">obituary writing prompts page</Link>. For the planning sheet, use the <Link href="/obituary-story-worksheet/">obituary story worksheet</Link>.
              </p>
            </div>
            <Link href="/obituary-examples/">{absoluteUrl("/obituary-examples/")}</Link>
          </section>
        </article>
      </main>
      <footer>
        Obituary examples as sourced life stories. <Link href="/about/">Read the editorial method</Link>.
      </footer>
    </>
  );
}
