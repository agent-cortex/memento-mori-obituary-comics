import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Obituary wording examples and phrases for opening lines, family lists, service details, memorial donations, cause-of-death privacy, and final proof review.";

const wordingExamples = [
  {
    title: "Opening death announcement",
    text: "[Full name], [age], of [city], died on [date].",
    use: "Use a plain opening when the family wants clarity, when the newspaper has a strict word limit, or when the cause of death should stay private.",
  },
  {
    title: "Warmer opening line",
    text: "[Full name], known to family and friends as [preferred name], died on [date] after a life shaped by [work, care, service, faith, craft, community, or family].",
    use: "Use this when the obituary has room for one human frame before the facts continue.",
  },
  {
    title: "Survived by wording",
    text: "[Name] is survived by [spouse or partner]; [children and spouses]; [grandchildren]; [siblings]; and [chosen family, close friends, or caregivers if the family wants them named].",
    use: "Use this after checking spellings, relationship labels, blended-family wording, and the order the family prefers.",
  },
  {
    title: "Preceded in death wording",
    text: "[Name] was preceded in death by [parents, spouse or partner, siblings, children, or other relatives the family wants included].",
    use: "Use this when the family wants to name close relatives who died earlier, without turning the paragraph into a genealogy record.",
  },
  {
    title: "Service or private-service wording",
    text: "A [funeral, memorial, visitation, burial, celebration of life, or private gathering] will be held at [time] on [date] at [location].",
    use: "Use exact service wording only after confirming the address, time zone, livestream path, access notes, and whether the event is public or private.",
  },
  {
    title: "Memorial donation wording",
    text: "In memory of [Name], memorial gifts may be directed to [official organization, fund, or family-support page] at [verified link or mailing address].",
    use: "Use this after confirming whether gifts go to a registered charity, memorial fund, scholarship, church, hospice, or family-support account.",
  },
  {
    title: "Cause-of-death privacy wording",
    text: "[Name] died on [date], surrounded by [family, loved ones, or care team].",
    use: "Use this when the family wants warmth without publishing medical details, addiction context, suicide context, accident details, or private family circumstances.",
  },
  {
    title: "Correction-safe proof wording",
    text: "Please review names, dates, service times, donation links, and family wording before final approval.",
    use: "Use this as an internal proof note before submitting to a newspaper, funeral home, memorial site, or family group.",
  },
];

const wordingDecisions = [
  {
    title: "Choose direct words for public facts",
    text: "A reader should be able to identify who died, when, and where services or memorial instructions belong. If the first sentence feels poetic but unclear, rewrite it plainly.",
  },
  {
    title: "Use family language the family recognizes",
    text: "Survivor lists can include spouses, partners, step-relatives, chosen family, caregivers, and close friends, but the final wording should be checked by someone who knows the relationships.",
  },
  {
    title: "Separate public story from private grief",
    text: "Medical history, conflict, exact addresses, financial details, and unsafe service-timing details can move to private family notes instead of the public obituary.",
  },
  {
    title: "Let one specific detail carry the tribute",
    text: "A short phrase about a room, recipe, route, tool, habit, classroom, garden, song, or repeated kindness usually says more than a list of broad compliments.",
  },
];

const finalChecks = [
  "Confirm the preferred name, legal name, maiden name, suffix, nickname, and pronunciation if relevant.",
  "Check each survivor and predeceased-family name with at least one family reviewer.",
  "Verify the service date, time, location, livestream link, funeral-home page, and whether the gathering is public or private.",
  "Open every memorial donation link from a fresh browser tab and confirm the organization name before publishing.",
  "Cut or generalize private medical, address, financial, conflict, and security-sensitive details.",
  "Save the approved draft so the family can spot copied, altered, or fake obituary pages later.",
];

const referenceLinks = [
  {
    label: "Legacy: obituary examples",
    href: "https://www.legacy.com/memorial-writing/obituary-examples",
    note: "Explains core obituary components: announcement, biographical sketch, family members, and memorial-service details.",
  },
  {
    label: "OfficialObituary: obituary wording",
    href: "https://officialobituary.com/guides/obituary-wording",
    note: "Current phrase bank for opening lines, life-story wording, family lists, service details, memorial requests, and difficult situations.",
  },
  {
    label: "Ever Loved: short obituary templates",
    href: "https://everloved.com/articles/obituaries-and-funeral-announcements/short-obituary-templates-and-examples/",
    note: "Short obituary templates with survivor, predeceased-family, service, and private-service language.",
  },
  {
    label: "Everplans: death notice and obituary templates",
    href: "https://www.everplans.com/articles/death-notice-templates-and-obituary-templates",
    note: "Death notice and obituary template formats with family, service, and donation fields.",
  },
  {
    label: "Dignity Memorial: death announcement guide",
    href: "https://www.dignitymemorial.com/grief-and-sympathy/losing-a-loved-one/how-to-write-a-death-announcement",
    note: "Family-facing death-announcement guidance for sharing news by obituary, digital message, or other channels.",
  },
  {
    label: "US Urns Online: death announcements",
    href: "https://www.usurnsonline.com/funeral-resources/death-announcements/",
    note: "Explains death-announcement wording, timing, channels, and relationship to obituary placement.",
  },
];

export const metadata = {
  title: "Obituary Wording Examples and Phrases",
  description,
  keywords: [
    "obituary wording",
    "obituary wording examples",
    "obituary phrases",
    "obituary announcement wording",
    "survived by wording",
    "preceded in death wording",
    "death announcement wording",
  ],
  alternates: {
    canonical: "/obituary-wording/",
  },
  openGraph: {
    type: "article",
    title: `Obituary Wording Examples and Phrases | ${SITE_NAME}`,
    description,
    url: "/obituary-wording/",
  },
  twitter: {
    title: `Obituary Wording Examples and Phrases | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryWordingPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const featured = comics.slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/obituary-wording/#article`,
        headline: "Obituary Wording Examples and Phrases",
        name: "Obituary Wording Examples and Phrases",
        url: absoluteUrl("/obituary-wording/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/obituary-wording/#webpage` },
        about: ["obituary wording", "obituary phrases", "death announcement wording", "survived by wording", "preceded in death wording"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary wording examples and phrases",
          itemListElement: wordingExamples.map((example, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: example.title,
            description: `${example.text} ${example.use}`,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-wording/#webpage`,
        name: "Obituary Wording Examples and Phrases",
        url: absoluteUrl("/obituary-wording/"),
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
      <main className="wrap section about-page explainer-page obituary-wording-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Obituary wording</div>
            <h1>Obituary Wording Examples</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/free-obituary-generator/">Generator</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/short-obituary-examples/">Short examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-mistakes-to-avoid/">Mistakes to avoid</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Newspaper submission</Link>
              </Button>
              <Button asChild>
                <Link href="/what-not-to-include-in-an-obituary/">Privacy checklist</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              The safest obituary wording starts with a clear public fact, then adds family, service, memorial, and life-story language only after those details have been checked. A plain opening such as <strong>[Full name], [age], of [city], died on [date]</strong> is often better than a poetic first line that leaves readers unsure what happened.
            </p>
            <p>
              Use the examples below as wording options, not as mandatory formulas. Adapt the tone to the family, the publication rules, the public-private boundary, and the amount of room available in print or online.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="wording-examples">
            <div>
              <div className="kicker">Copy and adapt</div>
              <h2 id="wording-examples">Obituary Wording Examples By Section</h2>
            </div>
            <div className="worksheet-fields">
              {wordingExamples.map((example) => (
                <section className="worksheet-box" key={example.title}>
                  <h3>{example.title}</h3>
                  <p>{example.text}</p>
                  <p><strong>Use when:</strong> {example.use}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="choose-wording">
            <div>
              <div className="kicker">Tone and accuracy</div>
              <h2 id="choose-wording">Which Obituary Wording Should You Use?</h2>
            </div>
            <div className="stories-intent-list">
              {wordingDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="final-proof">
            <h2 id="final-proof">Final Proof Review</h2>
            <p>
              Wording problems usually become family problems when names, relationship labels, private details, or service instructions are wrong. Before sending the copy to a newspaper, funeral home, or memorial website, run this last pass.
            </p>
            <ol className="writing-guide-list">
              {finalChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Wording Resources</h2>
              <p>
                Use this page for obituary wording examples, death announcement wording, survived-by wording, preceded-in-death wording, family-list guidance, service wording, and general phrase-bank resources. For a private copyable draft, use the <Link href="/free-obituary-generator/">free obituary generator</Link>. For concise newspaper notices and brief death announcements, use the <Link href="/short-obituary-examples/">short obituary examples</Link>. For full obituary structures, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For sample story patterns, use the <Link href="/obituary-examples/">obituary examples page</Link>. For in-lieu-of-flowers and memorial contribution language, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For a pre-publication fact check, use the <Link href="/obituary-checklist/">obituary checklist</Link>. For common wording and proofing errors, use the <Link href="/obituary-mistakes-to-avoid/">obituary mistakes checklist</Link>.
              </p>
            </div>
            <Link href="/obituary-wording/">{absoluteUrl("/obituary-wording/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Related Wording Guidance</h2>
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
              {featured.map((comic) => {
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
        Clear obituary wording, checked before publication. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
