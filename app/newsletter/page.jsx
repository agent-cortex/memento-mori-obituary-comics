import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { SubstackSubscribe } from "@/components/substack-subscribe";
import { Button } from "@/components/ui/button";
import { comicImageMetadata, getLatestComic } from "@/lib/comics";
import { publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL, SUBSTACK_URL } from "@/lib/site";

const latestComic = getLatestComic();
const description = "A Substack dispatch for new obituary comics, source notes, and weekly memento mori reading.";
const images = comicImageMetadata(latestComic);

export const metadata = {
  title: "Borrowed Time Dispatch",
  description,
  alternates: {
    canonical: "/newsletter/",
  },
  openGraph: {
    type: "website",
    title: `Borrowed Time Dispatch | ${SITE_NAME}`,
    description,
    url: "/newsletter/",
    images,
  },
  twitter: {
    title: `Borrowed Time Dispatch | ${SITE_NAME}`,
    description,
    images,
  },
};

export default function NewsletterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/newsletter/#newsletter`,
        name: "Borrowed Time Dispatch",
        url: `${SITE_URL}/newsletter/`,
        description,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": `${SITE_URL}/#organization` },
        sameAs: SUBSTACK_URL,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section newsletter-page">
        <div className="newsletter-hero">
          <div className="kicker">Newsletter</div>
          <h1 id="newsletter-page-heading">Borrowed Time Dispatch</h1>
          <p>Get the next obituary comic by email, plus short source notes and one useful reflection for the week.</p>
          <div className="newsletter-page-actions">
            <Button asChild variant="primary">
              <Link href="/">Back to archive</Link>
            </Button>
          </div>
        </div>
        <SubstackSubscribe page />
      </main>
      <footer>
        Clean comics, verified lives, no motivational slop. <Link href="/">Archive</Link>.
      </footer>
    </>
  );
}
