import Link from "next/link";

import { ArchiveCard } from "@/components/archive-card";
import { LatestPanel } from "@/components/latest-panel";
import { RitualTools } from "@/components/ritual-tools";
import { SiteNav } from "@/components/site-nav";
import { SubstackSubscribe } from "@/components/substack-subscribe";
import { Button } from "@/components/ui/button";
import { comicImageMetadata, getComics, getLatestComic, homeSchema } from "@/lib/comics";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/lib/site";

const latestComic = getLatestComic();
const homeImages = comicImageMetadata(latestComic);

export const metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: homeImages,
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: homeImages,
  },
};

export default function HomePage() {
  const comics = getComics();
  const latest = getLatestComic();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema()) }} />
      <header className="home-hero">
        <SiteNav />
        <div className="home-hero-grid wrap">
          <section className="hero-copy" aria-label="Archive introduction">
            <div className="hero-label">Daily biographical comics</div>
            <h1>Obituary Comics</h1>
            <div className="hero-rule">
              <span />
              <i aria-hidden="true" />
              <span />
            </div>
            <p>Obituary comics are source-backed visual biographies about people who met death, illness, exile, violence, or loss and made work that outlived them.</p>
            <div className="btns">
              {latest ? (
                <Button asChild variant="primary">
                  <Link href={`/comics/${latest.slug}/#read`}>Read latest</Link>
                </Button>
              ) : null}
              <Button asChild>
                <Link href="#archive">Browse archive</Link>
              </Button>
            </div>
          </section>
          <LatestPanel comic={latest} />
        </div>
      </header>

      <main className="wrap section archive-section" id="archive">
        <div className="section-head">
          <div>
            <div className="kicker">Small shelf, not doomscroll</div>
            <h2>Archive</h2>
          </div>
          <p>Compact comic/PDF cards. Open a reader only when you choose it.</p>
        </div>
        <div className="archive-grid">
          {comics.length ? comics.map((comic, index) => <ArchiveCard comic={comic} priority={index === 0} key={comic.slug} />) : <div className="empty">No comics published yet.</div>}
        </div>
      </main>

      <section className="wrap section definition-section" aria-labelledby="what-are-obituary-comics">
        <div className="section-head">
          <div>
            <div className="kicker">Definition</div>
            <h2 id="what-are-obituary-comics">What Are Obituary Comics?</h2>
          </div>
          <p>Short visual biographies built for readers and crawlers.</p>
        </div>
        <p>
          Memento Mori Obituary Comics publishes compact, source-backed stories about artists, thinkers, athletes, and witnesses whose work was shaped by a direct encounter with mortality. Each entry keeps the comic pages as the primary reading experience, then adds crawlable summaries, dated context, source links, PDF access, and structured data so search engines and AI systems can understand the subject without relying on image OCR.
        </p>
      </section>

      <SubstackSubscribe />

      <section className="wrap section ritual-section" aria-label="Daily ritual tools">
        <div className="section-head">
          <div>
            <div className="kicker">Reader ritual</div>
            <h2>Pause Before Reading</h2>
          </div>
          <p>A small set of optional tools for the morning death-reminder ritual.</p>
        </div>
        <RitualTools />
      </section>

      <footer>
        Built for the morning death-reminder ritual. Clean comics, verified lives, no motivational slop. <Link href="/about/">Editorial method</Link>.
      </footer>
    </>
  );
}
