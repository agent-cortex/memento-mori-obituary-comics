import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicImageMetadata, getLatestComic } from "@/lib/comics";
import { publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const latestComic = getLatestComic();
const description = "Editorial method, source standards, and publishing notes for Memento Mori Obituary Comics.";
const images = comicImageMetadata(latestComic);

export const metadata = {
  title: "Editorial Method",
  description,
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    type: "website",
    title: `Editorial Method | ${SITE_NAME}`,
    description,
    url: "/about/",
    images,
  },
  twitter: {
    title: `Editorial Method | ${SITE_NAME}`,
    description,
    images,
  },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about/#about`,
        name: "About Memento Mori Obituary Comics",
        url: `${SITE_URL}/about/`,
        description,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section about-page">
        <div className="about-header-section">
          <div className="kicker">Editorial method</div>
          <h1>About Memento Mori Obituary Comics</h1>
        </div>
        <div className="about-grid">
          <div className="about-column">
            <p>Memento Mori Obituary Comics is a static visual archive of short biographical comics about people who faced death, illness, violence, exile, or loss and still made work that survived them.</p>
            <div className="about-card">
              <h2>How subjects are selected</h2>
              <p>Each subject needs a clear mortality pressure point and a body of work or thought that changed after, survived beyond, or was clarified by that encounter.</p>
            </div>
            <div className="about-card">
              <h2>Source standards</h2>
              <p>Each comic page lists sources in crawlable HTML. The preferred source trail is a mix of reference works, museums, primary collections, and reputable editorial accounts.</p>
            </div>
          </div>
          <div className="about-column">
            <div className="about-card">
              <h2>Format</h2>
              <p>The reader preserves the comic as images and PDF, while the page also includes text summaries, story notes, and structured data so search engines and AI systems can understand the work without relying on image OCR.</p>
            </div>
            <div className="about-card">
              <h2>Publisher</h2>
              <p>The archive is maintained as a small open-source publishing system for durable comic permalinks, crawlable source notes, and stable media delivery.</p>
            </div>
            <p className="about-back">
              <Button asChild variant="primary">
                <Link href="/">Back to archive</Link>
              </Button>
            </p>
          </div>
        </div>
      </main>
      <footer>Clean comics, verified lives, no motivational slop.</footer>
    </>
  );
}
