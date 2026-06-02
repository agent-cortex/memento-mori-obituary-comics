import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { SubstackSubscribe } from "@/components/substack-subscribe";
import { Button } from "@/components/ui/button";
import { firstImageUrl, getLatestComic } from "@/lib/comics";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Borrowed Time Dispatch",
  description: "A Substack dispatch for new obituary comics, source notes, and weekly memento mori reading.",
  alternates: {
    canonical: "/newsletter/",
  },
  openGraph: {
    title: `Borrowed Time Dispatch | ${SITE_NAME}`,
    description: "A Substack dispatch for new obituary comics, source notes, and weekly memento mori reading.",
    images: [firstImageUrl(getLatestComic())],
  },
};

export default function NewsletterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/newsletter/#newsletter`,
        name: "Borrowed Time Dispatch",
        url: `${SITE_URL}/newsletter/`,
        description: "Substack newsletter for new Memento Mori Obituary Comics.",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
        },
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
