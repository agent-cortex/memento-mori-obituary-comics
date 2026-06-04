import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A practical comparison of obituary, death notice, and funeral notice formats: what each one does, what to include, and when a family should use a short notice or a fuller life story.";

const comparisonRows = [
  {
    label: "Death notice",
    purpose: "Announces that someone died and gives essential service or memorial information.",
    bestFor: "Newspaper classifieds, funeral-home notices, quick community updates, and paid public announcements.",
    details: "Name, age or dates, place, survivors when needed, funeral or memorial details, donation note, and funeral-home contact.",
  },
  {
    label: "Obituary",
    purpose: "Tells the story of a life after a death, with facts, context, relationships, and a memorable detail.",
    bestFor: "Newspaper features, online memorials, family-history stories, tribute articles, and longer publication spaces.",
    details: "Death facts, family context, work, education, community, one defining scene, source checks, and service details where useful.",
  },
  {
    label: "Funeral notice",
    purpose: "Focuses on the service, visitation, burial, interment, livestream, or memorial gathering.",
    bestFor: "Time-sensitive service announcements and newspaper or funeral-home pages where arrangements are the main point.",
    details: "Date, time, location, officiant or institution, cemetery, visitation, livestream, and instructions for guests.",
  },
];

const decisionSteps = [
  {
    title: "Use a death notice when speed matters",
    text: "If the main job is to tell people what happened and where services will be held, use a concise death notice first. It can be published quickly and expanded later.",
  },
  {
    title: "Use an obituary when the story matters",
    text: "If readers need to understand who the person was, what shaped them, and what remains because of them, write an obituary or life-story article.",
  },
  {
    title: "Use a funeral notice when arrangements are the only public detail",
    text: "If the family wants privacy around biography but needs people to attend a service, publish a funeral notice with only the necessary logistics.",
  },
  {
    title: "Use both when cost or space is limited",
    text: "Many families place a short paid newspaper notice and publish a fuller obituary online, where there is more room for names, scenes, photographs, and source notes.",
  },
];

const checklist = [
  "Confirm the newspaper or funeral home's labels: some call all family-written notices obituaries, while others reserve obituary for staff-written articles.",
  "Ask whether the notice is paid, free, word-count limited, photo-limited, or subject to verification by a funeral home or official source.",
  "Decide what belongs in public: service details, family names, cause of death, addresses, medical details, and conflict should be handled deliberately.",
  "Preserve a citation for future genealogy: publication name, date, URL, page or image number, funeral home, and access date.",
  "If there is no published obituary, check funeral notices, death notices, probate notices, cemetery records, church bulletins, library indexes, and local history rooms.",
];

const referenceLinks = [
  {
    label: "Legacy.com: death notice and obituary definitions",
    href: "https://www.legacy.com/memorial-writing/difference-between-a-death-notice-and-obituary",
    note: "Defines a death notice as a short publication and an obituary as life-story writing.",
  },
  {
    label: "Empathy: obituary and death notice differences",
    href: "https://www.empathy.com/informing-others/the-difference-between-an-obituary-and-a-death-notice",
    note: "Explains how families use notices, obituaries, newspapers, online memorials, and community organizations.",
  },
  {
    label: "NewspaperArchive: obituary, funeral notice, and death notice",
    href: "https://newspaperarchive.com/blog/what-s-the-difference-between-an-obituary-funeral-notice-and-death-notice/",
    note: "Shows how historical newspapers used these labels and why death notices matter in genealogy research.",
  },
  {
    label: "Washington Post death notice placement help",
    href: "https://helpcenter.washingtonpost.com/hc/en-us/articles/115003676568-How-to-Place-Death-Notice-or-Obituary",
    note: "Example of a newspaper distinguishing paid death notices from staff-considered obituary coverage.",
  },
  {
    label: "Milwaukee Public Library obituaries and death notices",
    href: "https://www.mpl.org/genealogy/researching_the_family_tree/obituaries_and_death_notices.php",
    note: "Library research page explaining obituaries, death notices, indexes, and obituary databases.",
  },
  {
    label: "MERI death notice and obituary guide",
    href: "https://www.meri.org/resource/news/how-to-write-a-death-notice/",
    note: "Family-facing guidance on writing death notices and obituaries.",
  },
];

export const metadata = {
  title: "Obituary vs Death Notice: What Is the Difference?",
  description,
  keywords: [
    "obituary vs death notice",
    "death notice vs obituary",
    "obituary and death notice difference",
    "funeral notice vs obituary",
    "what is a death notice",
    "what is an obituary",
  ],
  alternates: {
    canonical: "/obituary-vs-death-notice/",
  },
  openGraph: {
    type: "article",
    title: `Obituary vs Death Notice | ${SITE_NAME}`,
    description,
    url: "/obituary-vs-death-notice/",
  },
  twitter: {
    title: `Obituary vs Death Notice | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryVsDeathNoticePage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-vs-death-notice/#article`,
        headline: "Obituary vs Death Notice: What Is the Difference?",
        name: "Obituary vs Death Notice: What Is the Difference?",
        url: absoluteUrl("/obituary-vs-death-notice/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-vs-death-notice/#webpage` },
        about: ["obituary vs death notice", "funeral notice", "obituary writing", "death notices"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary, death notice, and funeral notice comparison",
          itemListElement: comparisonRows.map((row, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: row.label,
            description: `${row.purpose} Best for: ${row.bestFor}`,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-vs-death-notice/#webpage`,
        name: "Obituary vs Death Notice: What Is the Difference?",
        url: absoluteUrl("/obituary-vs-death-notice/"),
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
      <main className="wrap section about-page explainer-page notice-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary vs death notice</div>
            <h1>Obituary vs Death Notice</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-research-guide/">Research guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-articles/">Article guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-vs-eulogy/">Eulogy explainer</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-story-worksheet/">Worksheet</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/fake-obituary-sites/">Fake site checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Newspaper submission</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              A death notice is usually a short public announcement: who died, when they died, and what service or memorial details people need. An obituary is usually a fuller life story: it still announces the death, but it also explains who the person was, what shaped their life, and why readers should remember them. A funeral notice is narrower still: it mainly tells people when and where to gather.
            </p>
            <p>
              The labels are not perfectly consistent. Some newspapers call family-written paid notices obituaries. Some reserve obituary for articles written by staff. Before writing, check the publication's rules and decide whether the family needs speed, story, service logistics, cost control, or all four.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="comparison">
            <div>
              <div className="kicker">Comparison</div>
              <h2 id="comparison">Obituary, Death Notice, Or Funeral Notice?</h2>
            </div>
            <div className="worksheet-fields">
              {comparisonRows.map((row) => (
                <section className="worksheet-box" key={row.label}>
                  <h3>{row.label}</h3>
                  <p>{row.purpose}</p>
                  <p><strong>Best for:</strong> {row.bestFor}</p>
                  <p><strong>Usually includes:</strong> {row.details}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="decision">
            <div>
              <div className="kicker">Decision guide</div>
              <h2 id="decision">Which One Should You Publish?</h2>
            </div>
            <div className="stories-intent-list">
              {decisionSteps.map((step) => (
                <article key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="before-sending">
            <h2 id="before-sending">Before Sending It To A Newspaper Or Funeral Home</h2>
            <ul className="writing-guide-list">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Death Notice Explainers</h2>
              <p>
                Use this page for newspaper help pages, funeral-home resources, genealogy guides, library obituary indexes, and articles explaining the difference between an obituary, death notice, and funeral notice. For paid notice price drivers, line fees, photo fees, and quote questions, use the <Link href="/obituary-cost/">obituary cost guide</Link>. For submission deadlines, proof of death, photo, and funeral-home verification rules, use the <Link href="/how-to-submit-an-obituary-to-a-newspaper/">newspaper obituary submission checklist</Link>. For obituary/eulogy comparison pages, use the <Link href="/obituary-vs-eulogy/">obituary vs eulogy explainer</Link>. For privacy and scam-safety guidance before publishing a public notice, use the <Link href="/what-not-to-include-in-an-obituary/">what not to include in an obituary checklist</Link>. For unfamiliar sites, copied notices, and fake donation links, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For drafting a fuller life story, use the <Link href="/how-to-write-an-obituary-story/">obituary story writing guide</Link>. For source lookups and citations, use the <Link href="/obituary-research-guide/">obituary research guide</Link>. For reported examples, use the <Link href="/obituary-articles/">obituary articles page</Link>.
              </p>
            </div>
            <Link href="/obituary-vs-death-notice/">{absoluteUrl("/obituary-vs-death-notice/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Related Resources</h2>
            </div>
            <ul className="press-subject-list">
              {referenceLinks.map((reference) => (
                <li key={reference.href}>
                  <a href={reference.href}>{reference.label}</a>
                  <p>{reference.note}</p>
                </li>
              ))}
            </ul>
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
        Death notices are announcements; obituaries can become stories. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
