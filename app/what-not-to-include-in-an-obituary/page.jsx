import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A privacy-first checklist for what not to include in an obituary: sensitive identity details, home addresses, exact service timing, financial information, private medical facts, and unverified family conflict.";

const avoidItems = [
  {
    label: "Full date of birth and exact birthplace",
    reason: "A full name, birthdate, birthplace, and family names can become identity-verification clues. Use age, month/year, or a broader place when the full detail is not needed.",
    safer: "Born in 1946 in western Pennsylvania.",
  },
  {
    label: "Home address or empty-house clues",
    reason: "A public address plus a service date can tell strangers where a house may be empty. Keep residential addresses out of the obituary.",
    safer: "A longtime resident of Pittsburgh.",
  },
  {
    label: "Social Security, maiden-name, and financial details",
    reason: "Never publish Social Security numbers, account information, estate value, insurance details, debts, tax details, or a mother's maiden name.",
    safer: "The family requests privacy while final affairs are handled.",
  },
  {
    label: "Exact service timing when privacy matters",
    reason: "If the service is public, list the official funeral-home page instead of repeating every logistical detail across social posts and reposted notices.",
    safer: "Service details are available through the funeral home.",
  },
  {
    label: "Private medical or cause-of-death details",
    reason: "Cause of death is optional. Medical history, addiction history, suicide, violence, disability, or mental-health details should be shared only when the family intentionally chooses that public record.",
    safer: "Died after a long illness, surrounded by family.",
  },
  {
    label: "Family conflict, blame, or unverified claims",
    reason: "An obituary is a public record that can be copied, indexed, archived, and quoted. Remove accusations, inheritance disputes, and details that living relatives have not confirmed.",
    safer: "Focus on verified facts, relationships, work, service, and one memory.",
  },
];

const decisionSteps = [
  {
    title: "Ask who needs this fact",
    text: "If a detail only satisfies curiosity, it probably does not belong in the public obituary. Keep it in a private family document instead.",
  },
  {
    title: "Check whether the fact helps the reader act",
    text: "Service location, donation instructions, and a funeral-home contact can help readers. A street address, bank detail, or private diagnosis usually does not.",
  },
  {
    title: "Assume the notice will be copied",
    text: "Online obituaries can be scraped by other sites, indexed by search engines, shared on social media, and saved in genealogy databases.",
  },
  {
    title: "Separate the obituary from the fact sheet",
    text: "Keep a private document with exact names, dates, records, and family contacts. Publish a shorter version that protects living people.",
  },
];

const quickChecklist = [
  "Remove exact home addresses, Social Security numbers, financial account details, estate values, passwords, and insurance information.",
  "Consider age instead of full birthdate, and a general location instead of exact birthplace when privacy risk is high.",
  "Link to the funeral home or official memorial page instead of reposting service details across many public places.",
  "Confirm every survivor name, spelling, relationship, and privacy preference before publishing.",
  "Leave out cause of death unless the family has made a deliberate public decision to include it.",
  "Watch for fake memorial pages, fake livestream links, debt-collector calls, and unexpected payment requests after the obituary goes online.",
];

const referenceLinks = [
  {
    label: "AARP: bereavement scams and obituary information",
    href: "https://www.aarp.org/money/scams-fraud/funeral-bereavement/",
    note: "Explains how scammers use obituary and funeral information to target grieving families.",
  },
  {
    label: "FBI El Paso: bereavement scams warning",
    href: "https://www.fbi.gov/contact-us/field-offices/elpaso/news/press-releases/fbi-el-paso-warns-about-scams-that-are-targeting-the-deceased-and-their-grieving-families-bereavement-scams",
    note: "Warns families to limit personal facts in obituaries and online memorial posts.",
  },
  {
    label: "Consumer Financial Protection Bureau: obituary debt-collector scams",
    href: "https://www.consumerfinance.gov/ask-cfpb/is-it-a-scam-if-a-debt-collector-calls-me-after-seeing-my-relatives-obituary-en-1483/",
    note: "Explains how scammers may use obituaries and legal notices to pose as debt collectors.",
  },
  {
    label: "FTC Consumer Advice: identity theft",
    href: "https://consumer.ftc.gov/idtheft",
    note: "Official identity-theft reporting and recovery guidance for consumers.",
  },
  {
    label: "Experian: obituaries and identity theft",
    href: "https://www.experian.com/blogs/ask-experian/what-you-need-to-know-about-obituaries-and-identity-theft/",
    note: "Consumer-credit guidance on how obituary information can enable identity theft after death.",
  },
  {
    label: "Trustworthy: details to avoid in an obituary",
    href: "https://www.trustworthy.com/blog/when-someone-dies/key-details-to-avoid-including-in-an-obituary",
    note: "Practical privacy guidance on personal, financial, and sensitive facts to leave out.",
  },
  {
    label: "Green Cremation Texas: what not to include",
    href: "https://www.cremation.green/how-to-write-an-obituary/",
    note: "Funeral-home writing guide that warns against publishing details that can expose identity or burglary risk.",
  },
];

export const metadata = {
  title: "What Not to Include in an Obituary: Privacy Checklist",
  description,
  keywords: [
    "what not to include in an obituary",
    "obituary privacy",
    "obituary identity theft",
    "obituary scams",
    "obituary safety checklist",
    "sensitive information in obituary",
  ],
  alternates: {
    canonical: "/what-not-to-include-in-an-obituary/",
  },
  openGraph: {
    type: "article",
    title: `What Not to Include in an Obituary | ${SITE_NAME}`,
    description,
    url: "/what-not-to-include-in-an-obituary/",
  },
  twitter: {
    title: `What Not to Include in an Obituary | ${SITE_NAME}`,
    description,
  },
};

export default function WhatNotToIncludeInAnObituaryPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/what-not-to-include-in-an-obituary/#article`,
        headline: "What Not to Include in an Obituary: Privacy Checklist",
        name: "What Not to Include in an Obituary: Privacy Checklist",
        url: absoluteUrl("/what-not-to-include-in-an-obituary/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/what-not-to-include-in-an-obituary/#webpage` },
        about: ["what not to include in an obituary", "obituary privacy", "obituary scams", "identity theft after death"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary details to avoid or handle carefully",
          itemListElement: avoidItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            description: `${item.reason} Safer wording: ${item.safer}`,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/what-not-to-include-in-an-obituary/#webpage`,
        name: "What Not to Include in an Obituary: Privacy Checklist",
        url: absoluteUrl("/what-not-to-include-in-an-obituary/"),
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
      <main className="wrap section about-page explainer-page obituary-privacy-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary privacy checklist</div>
            <h1>What Not to Include in an Obituary</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-story-worksheet/">Worksheet</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-vs-death-notice/">Notice explainer</Link>
              </Button>
              <Button asChild>
                <Link href="/fake-obituary-sites/">Fake site checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-mistakes-to-avoid/">Mistakes to avoid</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-research-guide/">Research guide</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              Do not include details that help a stranger impersonate the deceased, locate an empty home, pressure grieving relatives, or expose private medical and family information. A good obituary can still be warm, specific, and memorable without publishing every identifying fact.
            </p>
            <p>
              The safest approach is to keep a private fact sheet for the family and publish only the details that readers need: the name, a broad life context, a few meaningful memories, official service or memorial instructions, and a verified funeral-home or donation link.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="details-to-avoid">
            <div>
              <div className="kicker">Details to avoid</div>
              <h2 id="details-to-avoid">Leave These Out Or Handle Them Carefully</h2>
            </div>
            <div className="worksheet-fields">
              {avoidItems.map((item) => (
                <section className="worksheet-box" key={item.label}>
                  <h3>{item.label}</h3>
                  <p>{item.reason}</p>
                  <p><strong>Safer wording:</strong> {item.safer}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="decision">
            <div>
              <div className="kicker">Decision guide</div>
              <h2 id="decision">How To Decide Whether A Detail Belongs</h2>
            </div>
            <div className="stories-intent-list">
              {decisionSteps.map((step) => (
                <article key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="privacy-checklist">
            <h2 id="privacy-checklist">Before Publishing</h2>
            <ul className="writing-guide-list">
              {quickChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Privacy And Scam-Safety Resources</h2>
              <p>
                Use this page for funeral-home writing guides, consumer-safety pages, identity-theft explainers, estate-planning resources, hospice family guides, and articles about what not to include in an obituary. For broader proofing mistakes, missed facts, and correction steps, use the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>. For charity requests, memorial contributions, and in-lieu-of-flowers links, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For fake memorial pages, copied death notices, obituary piracy, and donation-link checks, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For a fuller story draft, use the <Link href="/how-to-write-an-obituary-story/">obituary story writing guide</Link>. For source lookup and citation work, use the <Link href="/obituary-research-guide/">obituary research guide</Link>. For short public announcements, use the <Link href="/obituary-vs-death-notice/">obituary vs death notice explainer</Link>.
              </p>
            </div>
            <Link href="/what-not-to-include-in-an-obituary/">{absoluteUrl("/what-not-to-include-in-an-obituary/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Related Resources</h2>
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
        Publish the story, not every private fact. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
