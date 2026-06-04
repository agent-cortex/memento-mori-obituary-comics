import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, getLatestComic, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Source-backed obituary stories and obituary articles told as short visual biographies, with comic reader pages, source trails, and citation notes.";

const searchIntents = [
  {
    title: "Obituary stories",
    text: "Narrative entries for readers looking for life stories rather than a bare death notice or funeral listing.",
  },
  {
    title: "Obituary articles",
    text: "Crawlable summaries, dates, source links, and editorial notes that make each visual biography usable for search and research.",
  },
  {
    title: "Visual obituaries",
    text: "Comic pages that turn a documented encounter with mortality into a compact, readable biographical sequence.",
  },
];

export const metadata = {
  title: "Obituary Stories and Articles",
  description,
  keywords: [
    "obituary stories",
    "obituary articles",
    "visual obituaries",
    "obituary comics",
    "biographical comics",
    "source-backed obituary stories",
  ],
  alternates: {
    canonical: "/obituary-stories/",
  },
  openGraph: {
    type: "website",
    title: `Obituary Stories and Articles | ${SITE_NAME}`,
    description,
    url: "/obituary-stories/",
  },
  twitter: {
    title: `Obituary Stories and Articles | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryStoriesPage() {
  const comics = getComics();
  const latest = getLatestComic();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/obituary-stories/#collection`,
        name: "Obituary Stories and Articles",
        url: absoluteUrl("/obituary-stories/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: ["obituary stories", "obituary articles", "visual obituaries", "biographical comics"],
        mainEntity: {
          "@type": "ItemList",
          name: "Source-backed obituary stories",
          itemListElement: comics.map((comic, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(comicPath(comic)),
            name: `${comic.person} - ${comic.title}`,
            description: comic.dek || "",
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section about-page stories-page">
        <div className="about-header-section stories-header-section">
          <div className="kicker">Obituary stories and articles</div>
          <h1>Obituary Stories</h1>
          <p>
            A source-backed archive of obituary articles told as short visual biographies. Each story pairs comic pages with crawlable text, citations, PDF access, and editorial notes.
          </p>
          <div className="stories-actions">
            {latest ? (
              <Button asChild variant="primary">
                <Link href={comicPath(latest)}>Read latest story</Link>
              </Button>
            ) : null}
            <Button asChild>
              <Link href="/press/">Link and press resources</Link>
            </Button>
          </div>
        </div>

        <section className="stories-intent-grid" aria-labelledby="search-intents">
          <div className="stories-intro">
            <div className="kicker">Search intent</div>
            <h2 id="search-intents">What This Archive Is For</h2>
            <p>
              These are not funeral notices or paid memorial listings. They are editorial obituary stories about artists, thinkers, athletes, witnesses, and public figures whose work is easier to remember through a visual narrative.
            </p>
          </div>
          <div className="stories-intent-list">
            {searchIntents.map((intent) => (
              <article key={intent.title}>
                <h3>{intent.title}</h3>
                <p>{intent.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-card stories-link-box" aria-labelledby="how-to-link">
          <div>
            <h2 id="how-to-link">Best Link Target</h2>
            <p>
              For roundups, resource pages, newsletters, and classroom reading lists, link to this page with natural anchors such as obituary stories, obituary articles, visual obituaries, or Memento Mori Obituary Comics.
            </p>
          </div>
          <Link href="/obituary-stories/">{absoluteUrl("/obituary-stories/")}</Link>
        </section>

        <section className="stories-index" aria-labelledby="story-index">
          <div className="press-subjects-head">
            <div>
              <div className="kicker">Story index</div>
              <h2 id="story-index">Current Obituary Articles</h2>
            </div>
          </div>
          <ul className="press-subject-list">
            {comics.map((comic) => {
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
      </main>
      <footer>
        Obituary stories as visual biography. <Link href="/about/">Read the editorial method</Link>.
      </footer>
    </>
  );
}
