import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Common obituary mistakes to avoid before publishing: wrong names, missing service details, generic wording, unsafe private details, broken donation links, price surprises, and skipped proof review.";

const mistakeGroups = [
  {
    title: "Writing from memory instead of a checked fact list",
    mistake:
      "Names, dates, schools, military units, hometowns, former spouses, step-relatives, and survivor lists are easy to type from memory and hard to repair after publication.",
    fix:
      "Build the draft from a checklist, then ask one family reviewer to check only facts and one reviewer to check tone, privacy, and omissions.",
    links: [
      { label: "Obituary checklist", href: "/obituary-checklist/" },
      { label: "Research guide", href: "/obituary-research-guide/" },
    ],
  },
  {
    title: "Leaving out the practical information readers need",
    mistake:
      "A warm tribute can still fail as a public notice if it omits service time, location, private-service wording, livestream information, funeral-home details, or memorial contribution instructions.",
    fix:
      "Check the first paragraph and final paragraph as if the rest were cut for print. The essential notice should still make sense by itself.",
    links: [
      { label: "Newspaper submission checklist", href: "/how-to-submit-an-obituary-to-a-newspaper/" },
      { label: "Memorial donation wording", href: "/memorial-donation-wording-obituary/" },
    ],
  },
  {
    title: "Letting generic praise replace specific memory",
    mistake:
      "Lines like loved by everyone or lived life to the fullest can be true, but they do not help strangers or future family members recognize the person.",
    fix:
      "Replace one broad adjective with one concrete image: a tool, room, route, recipe, phrase, act of care, place of work, or pressure point.",
    links: [
      { label: "Writing guide", href: "/how-to-write-an-obituary-story/" },
      { label: "Obituary examples", href: "/obituary-examples/" },
      { label: "Writing prompts", href: "/obituary-writing-prompts/" },
    ],
  },
  {
    title: "Publishing private or risky details",
    mistake:
      "Full birth dates, home addresses, financial details, family conflict, private medical facts, and exact house-empty timing can expose the family to avoidable risk.",
    fix:
      "Use public-safe wording: city instead of street address, age instead of full birth date, private service instead of detailed absence windows, and general cause-of-death language when privacy matters.",
    links: [
      { label: "What not to include", href: "/what-not-to-include-in-an-obituary/" },
      { label: "Fake obituary site checks", href: "/fake-obituary-sites/" },
    ],
  },
  {
    title: "Treating a link as a substitute for the obituary",
    mistake:
      "Some newspapers and obituary platforms allow memorial links, but the printed or submitted notice still needs to stand on its own without telling readers to leave for the real obituary.",
    fix:
      "Keep core facts, family context, service information, and donation wording in the submitted obituary. Use the link only for photos, guestbook, longer memories, or verified donation pages.",
    links: [
      { label: "Obituary vs death notice", href: "/obituary-vs-death-notice/" },
      { label: "Cost guide", href: "/obituary-cost/" },
    ],
  },
  {
    title: "Approving price, proof, and placement too quickly",
    mistake:
      "Obituary mistakes often become expensive when the family pays before checking the line count, photo fee, online bundle, print dates, final proof, and correction policy.",
    fix:
      "Ask for the written quote, review the proof aloud, verify every name and date, and save the approved draft so later copies or fake obituary pages can be compared against it.",
    links: [
      { label: "Obituary cost guide", href: "/obituary-cost/" },
      { label: "Obituary checklist", href: "/obituary-checklist/" },
    ],
  },
];

const correctionSteps = [
  "Save a screenshot or PDF of the published obituary before requesting changes.",
  "Mark the exact error: name, date, relationship, service detail, donation link, private fact, or misleading wording.",
  "Contact the funeral home, newspaper obituary desk, or memorial-site support path that accepted the original submission.",
  "Ask whether the online page can be corrected, whether a print correction is available, and whether extra fees apply.",
  "Share the corrected link with family and close contacts so the accurate version circulates first.",
];

const referenceLinks = [
  {
    label: "Legacy.com: obituary examples and common writing mistakes",
    href: "https://www.legacy.com/advice/obituary-examples/",
    note: "High-authority obituary platform covering core obituary elements and mistakes such as generic phrasing, missing service information, passive wording, and thin life details.",
  },
  {
    label: "Legacy.com Help Center: links in obituary notices",
    href: "https://www.legacy.com/contact/en/articles/12821680-can-i-include-a-link-in-my-obituary-notice",
    note: "Submission guidance explaining that memorial links should supplement, not replace, complete obituary content.",
  },
  {
    label: "ObituaryGuide: obituary writing pitfalls",
    href: "https://www.obituaryguide.com/pitfalls.php",
    note: "Long-running obituary-writing resource focused on avoiding formulaic wording and keeping attention on the life rather than only the death or funeral.",
  },
  {
    label: "Best Care Cremation: common obituary mistakes",
    href: "https://www.bestcarecremation.com/blog/what-are-common-obituary-mistakes-to-avoid/",
    note: "Current funeral-home guidance emphasizing fact checks, focused story choices, final review, and removing street addresses, financial details, and family conflict.",
  },
  {
    label: "All Veterans - All Families Cremations: mistakes to avoid",
    href: "https://allvetscremations.com/common-mistakes-to-avoid-when-writing-an-obituary/",
    note: "Family-facing funeral resource covering missing details, too much or too little information, personal tone, and accuracy before publication.",
  },
  {
    label: "Indiana Funeral Care: what if an obituary is inaccurate?",
    href: "https://www.indianafuneralcare.com/what-if-an-obituary-is-inaccurate",
    note: "Practical correction-oriented resource on inaccurate obituaries, publication standards, and contacting the obituary department after an error.",
  },
  {
    label: "FTC identity-theft planning transcript",
    href: "https://consumer.ftc.gov/system/files/documents/videos/identity-theft-planning-future-part-1/ftc_identity_theft_planning_for_the_future_transcript_segment_1.pdf",
    note: "Consumer-protection source discussing how obituary information can be useful to identity thieves, supporting a privacy pass before publication.",
  },
];

export const metadata = {
  title: "Obituary Mistakes To Avoid Before Publishing",
  description,
  keywords: [
    "obituary mistakes to avoid",
    "common obituary mistakes",
    "mistakes when writing an obituary",
    "obituary errors",
    "obituary proof review",
    "obituary correction",
  ],
  alternates: {
    canonical: "/obituary-mistakes-to-avoid/",
  },
  openGraph: {
    type: "article",
    title: `Obituary Mistakes To Avoid | ${SITE_NAME}`,
    description,
    url: "/obituary-mistakes-to-avoid/",
  },
  twitter: {
    title: `Obituary Mistakes To Avoid | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryMistakesToAvoidPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-mistakes-to-avoid/#article`,
        headline: "Obituary Mistakes To Avoid Before Publishing",
        name: "Obituary Mistakes To Avoid Before Publishing",
        url: absoluteUrl("/obituary-mistakes-to-avoid/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-mistakes-to-avoid/#webpage` },
        about: ["obituary mistakes", "obituary writing", "obituary corrections", "obituary proofing"],
        mainEntity: {
          "@type": "ItemList",
          name: "Common obituary mistakes to avoid",
          itemListElement: mistakeGroups.map((group, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: group.title,
            description: `${group.mistake} Fix: ${group.fix}`,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-mistakes-to-avoid/#webpage`,
        name: "Obituary Mistakes To Avoid Before Publishing",
        url: absoluteUrl("/obituary-mistakes-to-avoid/"),
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
      <main className="wrap section about-page explainer-page obituary-mistakes-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary mistakes</div>
            <h1>Obituary Mistakes To Avoid</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Examples</Link>
              </Button>
              <Button asChild>
                <Link href="/what-not-to-include-in-an-obituary/">Privacy checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Submission checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/fake-obituary-sites/">Fake obituary checks</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="why-mistakes-happen">
            <h2 id="why-mistakes-happen">Why Obituary Mistakes Happen</h2>
            <p>
              Obituaries are often written under deadline, grief, family pressure, newspaper price limits, and platform rules that differ by publisher. That is why the safest process is not just better wording. It is a slower proofing workflow: gather the facts, choose the story details, remove risky private information, check the price and proof, then publish.
            </p>
            <p>
              Use this page as the final review after the <Link href="/obituary-checklist/">obituary checklist</Link> and before newspaper, funeral-home, or memorial-site submission. It is especially useful when several family members disagree about survivor lists, cause-of-death language, service timing, or how much of the story belongs in public.
            </p>
          </section>

          <section className="explainer-principles" aria-labelledby="mistakes">
            <div>
              <div className="kicker">Review list</div>
              <h2 id="mistakes">Six Common Obituary Mistakes</h2>
            </div>
            <div className="stories-intent-list">
              {mistakeGroups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <p>{group.mistake}</p>
                  <p>{group.fix}</p>
                  <div className="stories-actions compact-actions">
                    {group.links.map((link) => (
                      <Button asChild key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="corrections">
            <h2 id="corrections">If The Obituary Is Already Published</h2>
            <p>
              Published obituary errors are not all handled the same way. A funeral-home page may be editable quickly, a newspaper print correction may follow a separate policy, and a copied obituary page may need a different abuse or takedown path. Start by preserving evidence and contacting the publisher that accepted the original copy.
            </p>
            <ol className="writing-guide-list">
              {correctionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Mistake Resources</h2>
              <p>
                Use this page for funeral-home writing guides, obituary-proofing resources, newspaper obituary desks, memorial-site help articles, family planning pages, and resource lists about common obituary mistakes. For a full pre-publication fact list, use the <Link href="/obituary-checklist/">obituary checklist</Link>. For sensitive details to leave out, use the <Link href="/what-not-to-include-in-an-obituary/">privacy checklist</Link>. For post-publication scams or copied pages, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For cost and proof approval questions, use the <Link href="/obituary-cost/">obituary cost guide</Link>.
              </p>
            </div>
            <Link href="/obituary-mistakes-to-avoid/">{absoluteUrl("/obituary-mistakes-to-avoid/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources Used For This Mistake Checklist</h2>
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
        Check facts before publication. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
