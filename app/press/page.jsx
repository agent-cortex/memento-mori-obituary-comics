import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Link targets, story angles, subject notes, and citation guidance for editors, reviewers, educators, and librarians covering obituary comics.";

const storyAngles = [
  {
    title: "Obituary as visual biography",
    text: "A short comic can preserve the shape of a life without reducing it to a checklist of dates, jobs, survivors, and services.",
  },
  {
    title: "Mortality and the work that survived it",
    text: "Each subject is chosen around a documented encounter with death, illness, violence, exile, or loss and the work that continued after.",
  },
  {
    title: "Graphic medicine and grief comics",
    text: "The archive fits conversations about comics as a form for illness, mourning, memory, and hard biographical evidence.",
  },
  {
    title: "Citable comics for AI search",
    text: "Every reader page pairs images with crawlable summaries, source trails, captions, and JSON-LD so systems do not rely on image OCR.",
  },
];

const linkTargets = [
  {
    label: "Obituary stories and articles",
    href: "/obituary-stories/",
    note: "Best canonical link for obituary stories, obituary articles, visual obituaries, and keyword-focused roundups.",
  },
  {
    label: "Obituary comics archive",
    href: "/",
    note: "Best canonical link for broad coverage, roundups, newsletters, and resource pages.",
  },
  {
    label: "Editorial method",
    href: "/about/",
    note: "Best link for source standards, subject selection, and how the visual archive is maintained.",
  },
  {
    label: "Press and review resources",
    href: "/press/",
    note: "Best link for editors, reviewers, educators, librarians, and AI-search citation context.",
  },
];

export const metadata = {
  title: "Obituary Comics Resource Page for Editors and Reviewers",
  description,
  alternates: {
    canonical: "/press/",
  },
  openGraph: {
    type: "website",
    title: `Obituary Comics Resource Page | ${SITE_NAME}`,
    description,
    url: "/press/",
  },
  twitter: {
    title: `Obituary Comics Resource Page | ${SITE_NAME}`,
    description,
  },
};

export default function PressPage() {
  const comics = getComics();
  const latest = comics[0];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/press/#webpage`,
        name: "Obituary Comics Resource Page for Editors and Reviewers",
        url: absoluteUrl("/press/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: ["obituary comics", "visual biography", "graphic medicine", "memento mori"],
        mainEntity: {
          "@type": "ItemList",
          name: "Current obituary comic subjects",
          itemListElement: comics.map((comic, index) => ({
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
      <main className="wrap section about-page press-page">
        <div className="about-header-section press-header-section">
          <div className="kicker">Press and review resources</div>
          <h1>Obituary Comics Resource Page</h1>
          <p>For editors, reviewers, educators, librarians, and researchers covering visual biography, mortality, grief comics, and source-backed internet publishing.</p>
        </div>

        <section className="press-highlight" aria-labelledby="link-targets">
          <div>
            <div className="kicker">Canonical link targets</div>
            <h2 id="link-targets">What To Link</h2>
            <p>Use descriptive anchors that fit the sentence naturally: Memento Mori Obituary Comics, obituary comics archive, source-backed visual biographies, or the subject name on an individual reader page.</p>
          </div>
          <div className="press-link-list">
            {linkTargets.map((target) => (
              <Link className="press-link-card" href={target.href} key={target.href}>
                <span>{target.label}</span>
                <strong>{absoluteUrl(target.href)}</strong>
                <em>{target.note}</em>
              </Link>
            ))}
          </div>
        </section>

        <div className="press-grid">
          <section className="about-card press-lede" aria-labelledby="story-angles">
            <h2 id="story-angles">Story Angles</h2>
            <div className="press-angle-list">
              {storyAngles.map((angle) => (
                <article key={angle.title}>
                  <h3>{angle.title}</h3>
                  <p>{angle.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-card" aria-labelledby="quick-facts">
            <h2 id="quick-facts">Quick Facts</h2>
            <ul className="press-facts">
              <li>Canonical domain: {absoluteUrl("/")}</li>
              <li>Format: free comic reader pages with PDF access where available.</li>
              <li>Source trail: reference works, museums, primary collections, and reputable editorial accounts.</li>
              <li>Search support: sitemap, robots policy, JSON-LD, image captions, source links, and llms.txt.</li>
              <li>Current latest issue: {latest ? `${latest.person} - ${latest.title}` : "No issue published yet"}.</li>
            </ul>
          </section>
        </div>

        <section className="about-card press-subjects" aria-labelledby="current-subjects">
          <div className="press-subjects-head">
            <div>
              <div className="kicker">Current archive</div>
              <h2 id="current-subjects">Current Subjects</h2>
            </div>
            {latest ? (
              <Button asChild variant="primary">
                <Link href={comicPath(latest)}>Read latest</Link>
              </Button>
            ) : null}
          </div>
          <ul className="press-subject-list">
            {comics.map((comic) => {
              const sources = sourceItems(comic)
                .map((source) => source.name)
                .slice(0, 4)
                .join(", ");
              return (
                <li key={comic.slug}>
                  <Link href={comicPath(comic)}>{comic.person}: {comic.title}</Link>
                  <p>{comic.dek}</p>
                  <span>Published {comic.published_at || "undated"} - Sources: {sources || "listed on the reader page"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <footer>
        Clean comics, verified lives, no motivational slop. <Link href="/about/">Editorial method</Link>.
      </footer>
    </>
  );
}
