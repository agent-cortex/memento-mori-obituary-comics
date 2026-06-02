import Link from "next/link";

import { ArchiveCard } from "@/components/archive-card";
import { LatestPanel } from "@/components/latest-panel";
import { RitualTools } from "@/components/ritual-tools";
import { SiteNav } from "@/components/site-nav";
import { SubstackSubscribe } from "@/components/substack-subscribe";
import { Button } from "@/components/ui/button";
import { getComics, getLatestComic, homeSchema } from "@/lib/comics";
import { firstImageUrl } from "@/lib/comics";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: `${SITE_NAME} - Daily Biographical Comics About Mortality and Work`,
  description: SITE_DESCRIPTION,
  openGraph: {
    images: [firstImageUrl(getLatestComic())],
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
            <p>Lives that met death early, then used borrowed time to make something that outlived them.</p>
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
