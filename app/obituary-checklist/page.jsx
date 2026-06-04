import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A practical obituary checklist for families gathering names, dates, service details, life-story notes, donation wording, newspaper requirements, costs, and privacy checks before publication.";

const checklistSections = [
  {
    title: "Essential public facts",
    items: [
      "Full legal name, preferred name, maiden name, nicknames, suffixes, and spelling checks",
      "Age, city of residence, date of death, and whether place or cause of death should stay private",
      "Funeral, visitation, memorial, burial, livestream, or private-service details",
      "Funeral home, cemetery, officiant, reception, or memorial-page information if it belongs in the notice",
    ],
  },
  {
    title: "Life story details",
    items: [
      "Birthplace, parents, childhood places, schools, degrees, military service, work, awards, and affiliations",
      "Marriage, partnership, children, grandchildren, chosen family, caregivers, mentors, and close community",
      "One specific scene, habit, object, recipe, route, room, tool, phrase, or photograph that makes the person recognizable",
      "Claims that need confirmation through records, clippings, letters, public sources, or family documents",
    ],
  },
  {
    title: "Family and survivor review",
    items: [
      "Surviving family names and relationships in the order the family prefers",
      "Predeceased family members, former spouses, step-relatives, and chosen-family language",
      "Name spellings, city names, school names, organization names, and titles",
      "A final family reader who can check tone, fairness, privacy, and missing context",
    ],
  },
  {
    title: "Publication choices",
    items: [
      "Whether this should be a short death notice, a fuller obituary, a funeral-home page, or an online memorial story",
      "Newspaper deadline, proof-of-death rules, word or line limits, photo rules, payment timing, and proofing process",
      "Whether the funeral home will submit the obituary or the family will contact the publication directly",
      "Whether print space is limited enough to use a short notice plus a fuller online story",
    ],
  },
  {
    title: "Cost and quote review",
    items: [
      "Minimum obituary or death-notice charge",
      "Whether pricing is by word, line, column inch, package, photo, run day, or online bundle",
      "Whether the quote includes print, online archive, guestbook, photos, extra days, and partner-site placement",
      "Whether a funeral-home statement lists the obituary as a third-party or cash-advance item",
    ],
  },
  {
    title: "Privacy and safety pass",
    items: [
      "Remove or generalize full birth date, home address, exact service timing risks, financial details, and private medical details",
      "Verify donation links, memorial fund names, charity pages, and family-support instructions before publication",
      "Leave out family conflict, rumors, legal claims, and sensitive facts that do not help the public story",
      "Save a clean approved draft so copied, altered, or fake obituary pages can be checked later",
    ],
  },
];

const finalReviewItems = [
  "Read the obituary aloud once for tone and once for facts.",
  "Check every name, date, place, service time, and link against the source of truth.",
  "Ask whether the first paragraph still works if a newspaper truncates the rest.",
  "Confirm the price and proof before payment or final approval.",
  "Keep the fuller life story somewhere permanent if the newspaper version must be short.",
];

const referenceLinks = [
  {
    label: "Everplans: death notice or obituary checklist",
    href: "https://www.everplans.com/articles/checklist-writing-a-death-notice-or-obituary",
    note: "Family-facing checklist covering basic death-notice details, biographical information, service details, and donation information.",
  },
  {
    label: "ObitsArchive: obituary template checklist",
    href: "https://www.obitsarchive.com/obituary-resource/obituary-template",
    note: "Template checklist for gathering announcement details, life events, family information, service information, and optional details before writing.",
  },
  {
    label: "Memorials.com: how to write an obituary",
    href: "https://www.memorials.com/info/how-to-write-an-obituary",
    note: "Step-by-step obituary-writing guide with emphasis on gathering information, structuring the life story, adding service details, and checking the draft.",
  },
  {
    label: "Survivorship A to Z: what to include and not include in an obituary",
    href: "https://survivorshipatoz.org/hiv/articles/obituaries/?sid=6177",
    note: "Pre-planning resource that separates biographical details, family information, funeral details, and optional details to include or leave out.",
  },
  {
    label: "American Heritage Cemetery & Funeral Home: how to write an obituary",
    href: "https://www.thehealingstartshere.com/resources/how-to-write-an-obituary",
    note: "Funeral-home resource that frames the obituary as both public notice and life account, with practical writing and planning context.",
  },
  {
    label: "Checklist.com: funeral planning checklist",
    href: "https://checklist.com/funeral-planning-checklist",
    note: "Broader funeral-planning checklist that includes collecting personal information for an obituary as one of the administrative tasks after a death.",
  },
];

export const metadata = {
  title: "Obituary Checklist: What To Gather Before Writing",
  description,
  keywords: [
    "obituary checklist",
    "writing an obituary checklist",
    "obituary information checklist",
    "what information to include in an obituary",
    "death notice checklist",
    "funeral obituary checklist",
  ],
  alternates: {
    canonical: "/obituary-checklist/",
  },
  openGraph: {
    type: "article",
    title: `Obituary Checklist | ${SITE_NAME}`,
    description,
    url: "/obituary-checklist/",
  },
  twitter: {
    title: `Obituary Checklist | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryChecklistPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-checklist/#article`,
        headline: "Obituary Checklist: What To Gather Before Writing",
        name: "Obituary Checklist: What To Gather Before Writing",
        url: absoluteUrl("/obituary-checklist/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-checklist/#webpage` },
        about: ["obituary checklist", "obituary writing", "death notice checklist", "obituary information"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary checklist sections",
          itemListElement: checklistSections.map((section, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: section.title,
            description: section.items.join("; "),
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-checklist/#webpage`,
        name: "Obituary Checklist: What To Gather Before Writing",
        url: absoluteUrl("/obituary-checklist/"),
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
      <main className="wrap section about-page explainer-page obituary-checklist-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary checklist</div>
            <h1>Obituary Checklist</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-story-worksheet/">Printable worksheet</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-mistakes-to-avoid/">Mistakes to avoid</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Newspaper submission</Link>
              </Button>
              <Button asChild>
                <Link href="/what-not-to-include-in-an-obituary/">Privacy checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Examples</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-use">
            <h2 id="quick-use">Use This Before Drafting</h2>
            <p>
              A useful obituary checklist does more than collect facts. It helps the family decide what belongs in public, what needs verification, what the newspaper or funeral home requires, and what can move to a longer online story if the printed notice is too expensive or too short.
            </p>
            <p>
              Work through the list once before writing, then again before approving the proof. The second pass catches misspelled names, missing survivors, unsafe public details, broken donation links, and cost surprises.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="checklist">
            <div>
              <div className="kicker">Checklist</div>
              <h2 id="checklist">What To Gather</h2>
            </div>
            <div className="worksheet-fields">
              {checklistSections.map((section) => (
                <section className="worksheet-box" key={section.title}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="final-review">
            <h2 id="final-review">Final Review Before Publication</h2>
            <ol className="writing-guide-list">
              {finalReviewItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Checklist Resources</h2>
              <p>
                Use this page for funeral-home planning pages, end-of-life checklists, family resource hubs, memorial-planning articles, and obituary writing resources that need a clear pre-publication checklist. For a fuller writing process, use the <Link href="/how-to-write-an-obituary-story/">obituary story writing guide</Link>. For a print-friendly notes page, use the <Link href="/obituary-story-worksheet/">obituary story worksheet</Link>. For price, line, photo, and quote questions, use the <Link href="/obituary-cost/">obituary cost guide</Link>. For newspaper deadlines and proof rules, use the <Link href="/how-to-submit-an-obituary-to-a-newspaper/">newspaper obituary submission checklist</Link>. For common proofing errors and corrections, use the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>. For details to leave out, use the <Link href="/what-not-to-include-in-an-obituary/">obituary privacy checklist</Link>. For copyable structures, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For sample story patterns, use the <Link href="/obituary-examples/">obituary examples page</Link>.
              </p>
            </div>
            <Link href="/obituary-checklist/">{absoluteUrl("/obituary-checklist/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Checklist Examples</h2>
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
        Check facts, cost, and privacy before publishing. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
