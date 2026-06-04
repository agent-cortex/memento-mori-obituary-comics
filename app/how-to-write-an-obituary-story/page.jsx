import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, getLatestComic, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A practical guide to writing an obituary story: gather evidence, choose the life-shaping moment, avoid generic praise, and turn a death notice into a sourced life story.";

const writingSteps = [
  {
    title: "Begin with the record",
    text: "Collect the full name, dates, places, family details, service information, work history, education, military service, and the publication rules before writing the first sentence.",
  },
  {
    title: "Choose the life-shaping moment",
    text: "A stronger obituary story usually turns on one pressure point: a move, illness, loss, invention, act of care, public work, private habit, or decision that reveals the person.",
  },
  {
    title: "Build a scene bank",
    text: "Ask for two or three specific scenes rather than broad praise. Good prompts include what the person kept doing under stress, what room they changed by entering, and what detail family members still quote.",
  },
  {
    title: "Separate evidence from tribute",
    text: "Affection belongs in an obituary, but factual claims still need care. Confirm dates, names, awards, spellings, and causes or circumstances before turning them into a polished line.",
  },
  {
    title: "Write for readers who did not know them",
    text: "A useful obituary story gives strangers enough context to understand why the person mattered while still sounding recognizable to family, friends, classmates, colleagues, and neighbors.",
  },
  {
    title: "Revise for dignity and privacy",
    text: "Remove medical details, conflict, addresses, or family facts that do not serve the public story. When in doubt, ask whether the detail helps memory or only satisfies curiosity.",
  },
];

const promptGroups = [
  {
    title: "Evidence prompts",
    items: [
      "What dates, names, places, and titles must be correct?",
      "Which details can be verified in records, articles, letters, photographs, or family documents?",
      "Which claims should be softened because they are memory, not documentation?",
    ],
  },
  {
    title: "Story prompts",
    items: [
      "What did this person keep doing when life became difficult?",
      "Which moment shows their character better than a list of adjectives?",
      "What did they make, repair, protect, teach, rescue, or pass on?",
    ],
  },
  {
    title: "Image prompts",
    items: [
      "Which photograph, object, room, uniform, tool, recipe, note, route, or place carries the story?",
      "What image would make the obituary feel specific without exposing private grief?",
      "Could one visual detail replace a paragraph of generic praise?",
    ],
  },
];

const storyFrame = [
  "Death notice: state the essential facts plainly and accurately.",
  "Life context: give the reader the family, place, work, faith, service, school, or community frame.",
  "Defining scene: choose one remembered moment that shows character in action.",
  "Legacy: name what remains in people, places, work, habits, stories, or records.",
  "Practical details: include services, memorial instructions, donation preferences, or a publication note when appropriate.",
];

export const metadata = {
  title: "How to Write an Obituary Story",
  description,
  keywords: [
    "how to write an obituary story",
    "obituary story",
    "obituary writing prompts",
    "life story obituary",
    "obituary articles",
    "visual obituary stories",
    "turn obituary into story",
  ],
  alternates: {
    canonical: "/how-to-write-an-obituary-story/",
  },
  openGraph: {
    type: "article",
    title: `How to Write an Obituary Story | ${SITE_NAME}`,
    description,
    url: "/how-to-write-an-obituary-story/",
  },
  twitter: {
    title: `How to Write an Obituary Story | ${SITE_NAME}`,
    description,
  },
};

export default function HowToWriteObituaryStoryPage() {
  const comics = getComics();
  const latest = getLatestComic();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-04");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/how-to-write-an-obituary-story/#article`,
        headline: "How to Write an Obituary Story",
        name: "How to Write an Obituary Story",
        url: absoluteUrl("/how-to-write-an-obituary-story/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-04",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/how-to-write-an-obituary-story/#webpage` },
        about: ["obituary story", "obituary writing", "life story obituary", "visual obituaries"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary story writing steps",
          itemListElement: writingSteps.map((step, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: step.title,
            description: step.text,
          })),
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/how-to-write-an-obituary-story/#webpage`,
        name: "How to Write an Obituary Story",
        url: absoluteUrl("/how-to-write-an-obituary-story/"),
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
      <main className="wrap section about-page explainer-page writing-guide-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary writing guide</div>
            <h1>How to Write an Obituary Story</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/free-obituary-generator/">Generator</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-stories/">Read obituary stories</Link>
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
                <Link href="/obituary-research-guide/">Research guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-vs-death-notice/">Notice explainer</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-writing-prompts/">Writing prompts</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-articles/">Article guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-lesson-plan/">Lesson plan</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Obituary examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-wording/">Wording</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/what-are-obituary-comics/">Obituary comics explainer</Link>
              </Button>
              {latest ? (
                <Button asChild>
                  <Link href={comicPath(latest)}>Latest example</Link>
                </Button>
              ) : null}
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="obituary-story-definition">
            <h2 id="obituary-story-definition">What Makes It A Story</h2>
            <p>
              An obituary story is not just a longer death notice. A death notice tells people that someone died and where services will happen. An obituary story also gives readers a shaped account of the life: the facts, the setting, the pressure point, and the detail that makes the person memorable.
            </p>
            <p>
              The goal is not to make grief decorative. The goal is to preserve a life with enough accuracy that family can recognize it, strangers can understand it, and future readers can cite it without guessing what is true.
            </p>
          </section>

          <section className="explainer-principles" aria-labelledby="writing-steps">
            <div>
              <div className="kicker">Process</div>
              <h2 id="writing-steps">Six Steps For A Better Obituary Story</h2>
            </div>
            <div className="stories-intent-list">
              {writingSteps.map((step) => (
                <article key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="story-frame">
            <h2 id="story-frame">A Simple Obituary Story Frame</h2>
            <p>
              Use this frame when the page, newspaper, funeral home, or memorial site allows enough room for a narrative. If you need a printable planning page, use the <Link href="/obituary-story-worksheet/">obituary story worksheet</Link> before drafting. Keep the order if you need clarity; rearrange it if the defining scene deserves to come first.
            </p>
            <ol className="writing-guide-list">
              {storyFrame.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="stories-intent-grid writing-guide-prompts" aria-labelledby="writing-prompts">
            <div className="stories-intro">
              <div className="kicker">Interview prompts</div>
              <h2 id="writing-prompts">Questions That Produce Specific Details</h2>
              <p>
                The best material usually comes from precise questions. Ask for scenes, objects, sayings, routines, places, and records before asking for adjectives.
              </p>
            </div>
            <div className="stories-intent-list">
              {promptGroups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Writing Articles</h2>
              <p>
                Use this page for articles, resource lists, family-history guides, grief-writing essays, and newsletters about how to turn an obituary into a sourced life story. For a private first draft, use the <Link href="/free-obituary-generator/">free obituary generator</Link>. For general information-gathering checklists, use the <Link href="/obituary-checklist/">obituary checklist</Link>. For opening lines, survived-by wording, preceded-in-death wording, and phrase-bank resources, use the <Link href="/obituary-wording/">obituary wording examples</Link>. For common proofing errors, missing details, and correction workflows, use the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>. For genealogy, library, and obituary-search links, use the <Link href="/obituary-research-guide/">obituary research guide</Link>. For newspaper and funeral-home pages comparing notice formats, use the <Link href="/obituary-vs-death-notice/">obituary vs death notice explainer</Link>. For pages about where, when, and how to place the obituary in a newspaper, use the <Link href="/how-to-submit-an-obituary-to-a-newspaper/">newspaper obituary submission checklist</Link>. For obituary price, line-fee, photo-fee, and short-print-notice decisions, use the <Link href="/obituary-cost/">obituary cost guide</Link>. For charity requests and in-lieu-of-flowers language, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For funeral-home and bereavement pages comparing written obituaries with spoken tributes, use the <Link href="/obituary-vs-eulogy/">obituary vs eulogy explainer</Link>. For privacy, identity-theft, and scam-safety resources, use the <Link href="/what-not-to-include-in-an-obituary/">what not to include in an obituary checklist</Link>. For copied notices, fake donation links, and obituary piracy, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For journalism lessons, newsroom resources, and feature-obituary writing links, use the <Link href="/obituary-articles/">obituary articles page</Link>. For classroom teaching resources, use the <Link href="/obituary-lesson-plan/">obituary lesson plan</Link>. For prompt lists and legacy interview questions, link to the <Link href="/obituary-writing-prompts/">obituary writing prompts page</Link>. For template roundups and reusable formats, link to the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For example roundups and sample-structure posts, link to the <Link href="/obituary-examples/">obituary examples page</Link>. For examples of the finished visual form, link to the <Link href="/obituary-stories/">obituary stories index</Link>.
              </p>
            </div>
            <Link href="/how-to-write-an-obituary-story/">{absoluteUrl("/how-to-write-an-obituary-story/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="examples">
            <div>
              <div className="kicker">Examples</div>
              <h2 id="examples">Read Source-Backed Obituary Stories</h2>
            </div>
            <ul className="press-subject-list">
              {comics.slice(0, 4).map((comic) => {
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
        </article>
      </main>
      <footer>
        Evidence-first obituary stories. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
