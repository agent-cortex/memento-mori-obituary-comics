import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, getLatestComic, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A classroom and library resource page for using source-backed obituary comics in visual biography, grief comics, graphic medicine, and life-writing contexts.";

const useCases = [
  {
    title: "Graphic medicine and grief comics",
    text: "Use the archive when discussing how comics handle illness, death, mourning, recovery, and the limits of language around traumatic experience.",
  },
  {
    title: "Biography and life writing",
    text: "Compare a visual obituary to a conventional obituary article: what changes when sequence, panel rhythm, and image emphasis carry part of the argument?",
  },
  {
    title: "Media literacy and citation",
    text: "Each reader page separates the creative presentation from the evidence layer: summaries, captions, source links, PDF access, canonical metadata, and JSON-LD.",
  },
  {
    title: "Short discussion sessions",
    text: "The comics are compact enough for one class period, reading group, library program, or newsletter assignment without requiring a full graphic novel.",
  },
];

const discussionPrompts = [
  "What does the comic choose as the turning point of the life, and what does it leave outside the frame?",
  "Which facts come from the surrounding source trail rather than the artwork itself?",
  "How does the page change if you read it as an obituary, a biography comic, a grief comic, or a graphic medicine text?",
  "What would be lost if the same subject were presented only as a text obituary?",
  "Where should visual interpretation stop and documented evidence begin?",
];

export const metadata = {
  title: "Obituary Comics for Educators and Libraries",
  description,
  keywords: [
    "obituary comics for educators",
    "obituary comics library resource",
    "graphic medicine resources",
    "grief comics discussion prompts",
    "visual biography classroom",
  ],
  alternates: {
    canonical: "/educators-libraries/",
  },
  openGraph: {
    type: "website",
    title: `Obituary Comics for Educators and Libraries | ${SITE_NAME}`,
    description,
    url: "/educators-libraries/",
  },
  twitter: {
    title: `Obituary Comics for Educators and Libraries | ${SITE_NAME}`,
    description,
  },
};

export default function EducatorsLibrariesPage() {
  const comics = getComics();
  const latest = getLatestComic();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/educators-libraries/#webpage`,
        name: "Obituary Comics for Educators and Libraries",
        url: absoluteUrl("/educators-libraries/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: ["graphic medicine", "grief comics", "visual biography", "obituary comics", "life writing"],
        audience: [
          { "@type": "EducationalAudience", educationalRole: "educator" },
          { "@type": "Audience", audienceType: "librarians" },
        ],
        mainEntity: {
          "@type": "ItemList",
          name: "Classroom-ready obituary comics",
          itemListElement: comics.slice(0, 8).map((comic, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(comicPath(comic)),
            name: `${comic.person} - ${comic.title}`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section about-page educator-page">
        <div className="about-header-section educator-header-section">
          <div className="kicker">Educators and libraries</div>
          <h1>Obituary Comics for Educators and Libraries</h1>
          <p>{description}</p>
          <div className="stories-actions">
            <Button asChild variant="primary">
              <Link href="/obituary-stories/">Browse obituary stories</Link>
            </Button>
            <Button asChild>
              <Link href="/what-are-obituary-comics/">Read the explainer</Link>
            </Button>
          </div>
        </div>

        <section className="stories-intent-grid educator-use-grid" aria-labelledby="resource-fit">
          <div className="stories-intro">
            <div className="kicker">Resource fit</div>
            <h2 id="resource-fit">Where This Archive Fits</h2>
            <p>
              This page is built for library guides, comics studies courses, death studies classes, graphic medicine programs, grief reading lists, and teachers looking for short source-backed visual biography examples.
            </p>
          </div>
          <div className="stories-intent-list">
            {useCases.map((useCase) => (
              <article key={useCase.title}>
                <h3>{useCase.title}</h3>
                <p>{useCase.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-card stories-link-box" aria-labelledby="library-link-target">
          <div>
            <h2 id="library-link-target">Best Link Target</h2>
            <p>
              For LibGuides, course pages, classroom handouts, reading lists, and resource roundups, use this page with natural anchors such as graphic medicine resources, grief comics, visual biography examples, or obituary comics for educators.
            </p>
          </div>
          <Link href="/educators-libraries/">{absoluteUrl("/educators-libraries/")}</Link>
        </section>

        <section className="educator-prompts" aria-labelledby="discussion-prompts">
          <div>
            <div className="kicker">Classroom use</div>
            <h2 id="discussion-prompts">Discussion Prompts</h2>
          </div>
          <ol>
            {discussionPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ol>
        </section>

        <section className="explainer-next" aria-labelledby="recommended-starts">
          <div>
            <div className="kicker">Recommended starts</div>
            <h2 id="recommended-starts">Short Reads With Clear Source Trails</h2>
          </div>
          <ul className="press-subject-list">
            {comics.slice(0, 6).map((comic) => {
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

        {latest ? (
          <section className="about-card educator-latest" aria-labelledby="latest-classroom-read">
            <h2 id="latest-classroom-read">Latest Classroom-Ready Read</h2>
            <p>
              The latest issue is <Link href={comicPath(latest)}>{latest.person}: {latest.title}</Link>. It includes the comic reader, source notes, crawlable summaries, captions, and PDF access where available.
            </p>
          </section>
        ) : null}
      </main>
      <footer>
        Built for short, source-backed visual biography sessions. <Link href="/press/">Press resources</Link>.
      </footer>
    </>
  );
}
