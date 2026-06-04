import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A practical obituary cost guide for families comparing newspaper obituary prices, online memorials, photos, line fees, funeral-home cash advances, and ways to keep a public notice affordable.";

const costDrivers = [
  {
    title: "Publication route",
    text: "A funeral-home website, online memorial page, community paper, regional newspaper, and major metro newspaper can all price obituaries differently. Start by choosing where the notice needs to appear.",
  },
  {
    title: "Length and layout",
    text: "Many newspapers charge by line, word, column inch, or package. A line in print is not the same thing as a line in a document, so ask the obituary desk to format the draft before quoting the final price.",
  },
  {
    title: "Photos",
    text: "A portrait can add a fixed fee, occupy extra lines, require a color upgrade, or change the package tier. Ask whether a small black-and-white photo, color photo, or online-only image changes the quote.",
  },
  {
    title: "Publication day and run length",
    text: "Weekend editions, Sunday placement, extra print days, and print-plus-online bundles can change the total. Confirm whether the quote covers one day, multiple days, and a permanent online listing.",
  },
  {
    title: "Funeral-home handling",
    text: "If the funeral home places the notice for the family, the newspaper charge may appear as a third-party or cash-advance item. Ask for the actual newspaper charge and whether any handling fee or markup applies.",
  },
  {
    title: "Corrections and late changes",
    text: "Corrections after approval, missed deadlines, extra proofs, and republication can add cost. Final-check names, dates, service times, donation links, and photo captions before approving the proof.",
  },
];

const quoteQuestions = [
  "What is the minimum charge for a paid obituary or death notice?",
  "Do you price by word, line, column inch, package, or online-only listing?",
  "How many characters usually fit in one print line?",
  "Is there a separate photo fee, and does the photo also count as lines?",
  "Does the quote include online placement, guestbook, archive duration, or a partner site?",
  "Do Saturday, Sunday, holiday, or extra-day runs cost more?",
  "Will I receive a proof and final price before payment is taken?",
  "If a funeral home submits for us, will the obituary charge appear as a cash advance on the statement?",
];

const savingTips = [
  {
    title: "Use a short print notice plus a fuller online story",
    text: "If the newspaper charges by line or inch, publish the essential facts in print and link relatives to a fuller obituary, memorial page, or funeral-home page with the longer life story.",
  },
  {
    title: "Cut repetition before cutting meaning",
    text: "Remove duplicate dates, repeated family labels, generic praise, and long organizational lists before removing the one detail that makes the person recognizable.",
  },
  {
    title: "Ask for the formatted line count",
    text: "A 180-word draft can price very differently across publications. Ask the paper to format it and confirm the exact line, inch, or package count before approval.",
  },
  {
    title: "Compare death notice and obituary options",
    text: "Some publications separate short death notices from longer obituaries. If budget is tight, ask whether a short notice can run first and a fuller obituary can live online.",
  },
  {
    title: "Check funeral-home and newspaper routes",
    text: "A funeral home may simplify verification and submission, but the family should still know the actual publication cost, payment timing, and proofing process.",
  },
  {
    title: "Use one approved photo",
    text: "Choose one clear portrait unless the publication's package includes more images. Multiple photos can increase cost and slow proof approval.",
  },
];

const mistakes = [
  "Do not assume a newspaper obituary is free just because the funeral home posts an online obituary at no charge.",
  "Do not compare quotes until you know whether each one includes print, online, photos, extra days, proofs, and partner-site placement.",
  "Do not approve a proof with an unverified memorial donation link; correcting a printed notice later may require another paid run.",
  "Do not let a line-fee quote pressure the family into publishing private details just because they already paid for space.",
  "Do not rely on national averages for a local decision; confirm the current price with the exact publication.",
  "Do not treat a funeral-home cash advance as unexplained. Ask what third-party obituary charge was paid and how it appears on the statement.",
];

const referenceLinks = [
  {
    label: "Legacy.com: how much does an obituary cost?",
    href: "https://www.legacy.com/contact/en/articles/10752883-how-much-does-an-obituary-cost",
    note: "Explains common pricing drivers for online and newspaper obituaries, including publication route, line fees, image fees, and shortening a print version to manage cost.",
  },
  {
    label: "FTC: the Funeral Rule",
    href: "https://consumer.ftc.gov/articles/ftc-funeral-rule",
    note: "Consumer guidance on funeral price information, itemized price lists, and choosing only the goods and services wanted.",
  },
  {
    label: "FTC: complying with the Funeral Rule",
    href: "https://www.ftc.gov/tips-advice/business-center/guidance/complying-funeral-rule",
    note: "Business guidance explaining itemized funeral statements and cash-advance items, including third-party obituary notices.",
  },
  {
    label: "Star Tribune paid obituary FAQ",
    href: "https://cdn-assets.prfct.cc/assets/obits/pdf/ST_Obit_FAQ_sheet.pdf",
    note: "Example newspaper FAQ showing per-line pricing, character-per-line guidance, photo line impact, and online obituary inclusion.",
  },
  {
    label: "Embarcadero Media obituary pricing FAQ",
    href: "https://obituaries.almanacnews.com/obituaries/Obit-Pricing-and-FAQ.pdf",
    note: "Example 2026 rate card showing how local newspaper obituary packages can vary by ad size, word limit, photo, and publication.",
  },
  {
    label: "Funeral.com: digital and newspaper obituary costs",
    href: "https://funeral.com/blogs/the-journal/how-much-do-digital-and-newspaper-obituaries-cost-2025-2026-price-ranges-and-ways-to-save",
    note: "Family-facing overview of cost differences between death notices, newspaper obituaries, digital memorials, photos, and publication choices.",
  },
  {
    label: "Trustworthy: how much does an obituary cost?",
    href: "https://www.trustworthy.com/blog/how-much-does-obituary-cost",
    note: "End-of-life planning article covering where an obituary is published, word count, photos, writing help, and number of newspaper run days.",
  },
];

export const metadata = {
  title: "Obituary Cost Guide: Newspaper and Online Prices",
  description,
  keywords: [
    "obituary cost",
    "newspaper obituary cost",
    "how much does an obituary cost",
    "obituary price",
    "cost to publish an obituary",
    "paid obituary cost",
    "death notice cost",
  ],
  alternates: {
    canonical: "/obituary-cost/",
  },
  openGraph: {
    type: "article",
    title: `Obituary Cost Guide | ${SITE_NAME}`,
    description,
    url: "/obituary-cost/",
  },
  twitter: {
    title: `Obituary Cost Guide | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryCostPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-cost/#article`,
        headline: "Obituary Cost Guide: Newspaper and Online Prices",
        name: "Obituary Cost Guide: Newspaper and Online Prices",
        url: absoluteUrl("/obituary-cost/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-cost/#webpage` },
        about: ["obituary cost", "newspaper obituary cost", "paid obituary", "death notice cost"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary cost drivers",
          itemListElement: costDrivers.map((driver, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: driver.title,
            description: driver.text,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-cost/#webpage`,
        name: "Obituary Cost Guide: Newspaper and Online Prices",
        url: absoluteUrl("/obituary-cost/"),
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
      <main className="wrap section about-page explainer-page obituary-cost-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary cost guide</div>
            <h1>Obituary Cost Guide</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Newspaper submission</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-vs-death-notice/">Notice explainer</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/short-obituary-examples/">Short examples</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/what-not-to-include-in-an-obituary/">Privacy checklist</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              There is no single obituary cost. The final price depends on the exact publication, whether the notice runs in print or online, the length after newspaper formatting, photo rules, publication day, extra run days, and whether a funeral home places the notice for the family.
            </p>
            <p>
              The safest way to control the cost is to ask for a formatted quote before approval. If the print quote is high, use a short paid newspaper notice for the essential facts and publish the fuller life story online, where length and photos may be handled differently.
            </p>
          </section>

          <section className="explainer-principles" aria-labelledby="drivers">
            <div>
              <div className="kicker">Price drivers</div>
              <h2 id="drivers">What Changes The Obituary Price?</h2>
            </div>
            <div className="stories-intent-list">
              {costDrivers.map((driver) => (
                <article key={driver.title}>
                  <h3>{driver.title}</h3>
                  <p>{driver.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="worksheet-grid" aria-labelledby="quote">
            <div>
              <div className="kicker">Before payment</div>
              <h2 id="quote">Questions To Ask Before Approving A Quote</h2>
            </div>
            <div className="worksheet-fields">
              {quoteQuestions.map((question, index) => (
                <section className="worksheet-box" key={question}>
                  <h3>Question {index + 1}</h3>
                  <p>{question}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="save">
            <div>
              <div className="kicker">Budget choices</div>
              <h2 id="save">Ways To Keep The Obituary Affordable</h2>
            </div>
            <div className="stories-intent-list">
              {savingTips.map((tip) => (
                <article key={tip.title}>
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="mistakes">
            <h2 id="mistakes">Avoid These Cost Mistakes</h2>
            <ul className="writing-guide-list">
              {mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Cost Resources</h2>
              <p>
                Use this page for funeral-cost articles, newspaper obituary pricing pages, funeral-home planning guides, consumer-advocacy resources, and family budgeting pages that explain paid obituaries or death notice costs. For a general pre-publication information checklist, use the <Link href="/obituary-checklist/">obituary checklist</Link>. For placement deadlines and proof-of-death rules, use the <Link href="/how-to-submit-an-obituary-to-a-newspaper/">newspaper obituary submission checklist</Link>. For short notice versus full obituary decisions, use the <Link href="/obituary-vs-death-notice/">obituary vs death notice explainer</Link>. For a short print draft, use the <Link href="/short-obituary-examples/">short obituary examples</Link>; for a fuller draft, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For donation language before publication, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For public-detail review, use the <Link href="/what-not-to-include-in-an-obituary/">obituary privacy checklist</Link>.
              </p>
            </div>
            <Link href="/obituary-cost/">{absoluteUrl("/obituary-cost/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Example Pricing Policies</h2>
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
        Confirm the final quote before approving a paid obituary. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
