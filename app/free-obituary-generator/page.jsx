import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

import { ObituaryDraftBuilder } from "./obituary-draft-builder";

const description =
  "A free obituary generator that turns verified facts, family names, service details, memorial donation wording, and one life-story detail into a private draft you can edit before publication.";

const generatorIncludes = [
  {
    title: "Verified facts first",
    text: "The draft starts with the public basics: full name, age, city or community, date of death, and service status. Empty fields stay visible instead of being invented.",
  },
  {
    title: "One human detail",
    text: "A short life detail gives the obituary a recognizable center, whether the final version is a newspaper notice, funeral-home page, or longer online story.",
  },
  {
    title: "Family wording",
    text: "Survived-by and preceded-in-death language is kept separate so a family reviewer can check order, spelling, privacy, and relationship terms.",
  },
  {
    title: "Service and donation pass",
    text: "The draft keeps service wording and memorial gift language explicit, making it easier to verify addresses, times, livestreams, charity names, and donation links.",
  },
  {
    title: "Private by design",
    text: "The generator runs in the browser. It does not send entered names, dates, family lists, or memories to a server.",
  },
  {
    title: "Editable output",
    text: "Copy the draft, then revise tone, length, facts, and publication requirements before sending it to a newspaper, funeral home, or memorial platform.",
  },
];

const publishChecks = [
  "Check every name, city, date, service time, funeral-home name, cemetery name, and donation link against the source of truth.",
  "Ask one family reviewer to check survivor order, predeceased-family wording, spelling, and sensitive omissions.",
  "Remove or generalize full birth dates, home addresses, exact private-service timing, private medical details, and financial information.",
  "Confirm newspaper word limits, proof deadline, price, photo rules, and whether the funeral home submits the obituary.",
  "Save the approved version so copied, altered, or fake obituary pages can be compared against the family-approved text.",
];

const linkTargets = [
  {
    label: "Short obituary examples",
    href: "/short-obituary-examples/",
    text: "Use when the draft needs to fit a brief newspaper notice, death announcement, or compact funeral-home page.",
  },
  {
    label: "Obituary wording examples",
    href: "/obituary-wording/",
    text: "Use for opening lines, survived-by wording, preceded-in-death wording, service language, and cause-of-death privacy phrasing.",
  },
  {
    label: "Life story obituary template",
    href: "/life-story-obituary-template/",
    text: "Use when the generated draft needs a fuller structure for family history, online memorial pages, or visual obituary stories.",
  },
  {
    label: "Obituary checklist",
    href: "/obituary-checklist/",
    text: "Use before publication to confirm facts, family review, service details, donation language, costs, and privacy choices.",
  },
];

const referenceLinks = [
  {
    label: "CreateMemorial obituary template generator",
    href: "https://creatememorial.com/obituary-template",
    note: "Current generator result for free obituary template and generator searches.",
  },
  {
    label: "AI Written Obituary free generator",
    href: "https://aiwrittenobituary.com/",
    note: "Current free AI obituary generator result with family-facing draft positioning.",
  },
  {
    label: "aiwriter.ai AI obituary writer",
    href: "https://aiwriter.ai/tools/ai-obituary-writer",
    note: "AI writing-tool result with fields for name, age, city, life details, survivors, and tone.",
  },
  {
    label: "FuneralFolio online obituary writer",
    href: "https://www.funeralfolio.com/online-obituary-writer",
    note: "Free obituary writer result emphasizing guided questions, private drafting, and editable output.",
  },
  {
    label: "Gather AI obituary builder",
    href: "https://gather.app/ai-obituary-builder/",
    note: "Funeral-home software result for AI-assisted obituary drafting and case-management integration.",
  },
  {
    label: "After memorial obituary assistant",
    href: "https://after.io/",
    note: "Online memorial platform result with AI-enhanced obituary writing and family collaboration.",
  },
  {
    label: "OfficialObituary free obituary generator",
    href: "https://officialobituary.com/free-obituary-generator",
    note: "Generator resource from the obituary-writing SERP set.",
  },
  {
    label: "Tribute Archive AI obituary writer",
    href: "https://www.tributearchive.com/ai-obituary-writer",
    note: "Obituary platform result for AI-assisted obituary writing.",
  },
];

export const metadata = {
  title: "Free Obituary Generator and Draft Builder",
  description,
  keywords: [
    "free obituary generator",
    "obituary generator",
    "AI obituary generator",
    "obituary creator",
    "obituary draft builder",
    "obituary template generator",
    "free obituary writer",
  ],
  alternates: {
    canonical: "/free-obituary-generator/",
  },
  openGraph: {
    type: "website",
    title: `Free Obituary Generator and Draft Builder | ${SITE_NAME}`,
    description,
    url: "/free-obituary-generator/",
  },
  twitter: {
    title: `Free Obituary Generator and Draft Builder | ${SITE_NAME}`,
    description,
  },
};

export default function FreeObituaryGeneratorPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const featured = comics.slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${SITE_URL}/free-obituary-generator/#app`,
        name: "Free Obituary Generator and Draft Builder",
        applicationCategory: "WritingApplication",
        operatingSystem: "Web",
        url: absoluteUrl("/free-obituary-generator/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Private in-browser obituary drafting",
          "Short notice, standard obituary, and story lead draft lengths",
          "Family wording, service wording, and memorial donation fields",
          "Copyable draft output",
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Article",
        "@id": `${SITE_URL}/free-obituary-generator/#article`,
        headline: "Free Obituary Generator and Draft Builder",
        name: "Free Obituary Generator and Draft Builder",
        url: absoluteUrl("/free-obituary-generator/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/free-obituary-generator/#webpage` },
        about: ["free obituary generator", "obituary generator", "obituary creator", "obituary writing"],
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/free-obituary-generator/#webpage`,
        name: "Free Obituary Generator and Draft Builder",
        url: absoluteUrl("/free-obituary-generator/"),
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: { "@id": `${SITE_URL}/free-obituary-generator/#app` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav />
      <main className="wrap section about-page explainer-page generator-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Free obituary generator</div>
            <h1>Free Obituary Generator</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="#generator-tool-heading">Start draft</Link>
              </Button>
              <Button asChild>
                <Link href="/short-obituary-examples/">Short examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-wording/">Wording</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
            </div>
          </header>

          <ObituaryDraftBuilder />

          <section className="explainer-body" aria-labelledby="generator-answer">
            <h2 id="generator-answer">What A Free Obituary Generator Should Do</h2>
            <p>
              A useful obituary generator should create an editable starting draft, not publish automatically and not invent missing facts. The safest workflow is to draft from verified details, copy the result, then review names, dates, service details, donation links, privacy boundaries, and publication rules before anyone approves the final obituary.
            </p>
            <p>
              This generator is built for families, funeral-home resource pages, newspapers, libraries, and writing guides that need a private draft builder alongside examples, templates, and proofing checklists.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="generator-includes">
            <div>
              <div className="kicker">Included</div>
              <h2 id="generator-includes">What This Generator Includes</h2>
            </div>
            <div className="worksheet-fields">
              {generatorIncludes.map((item) => (
                <section className="worksheet-box" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="publish-checks">
            <div>
              <div className="kicker">Before publishing</div>
              <h2 id="publish-checks">Run This Check On The Generated Draft</h2>
            </div>
            <div className="stories-intent-list">
              <article>
                <h3>Final review checklist</h3>
                <ol>
                  {publishChecks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </article>
            </div>
          </section>

          <section className="worksheet-grid" aria-labelledby="related-tools">
            <div>
              <div className="kicker">Next step</div>
              <h2 id="related-tools">After You Generate A Draft</h2>
            </div>
            <div className="worksheet-fields">
              {linkTargets.map((target) => (
                <section className="worksheet-box" key={target.href}>
                  <h3><Link href={target.href}>{target.label}</Link></h3>
                  <p>{target.text}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Obituary Generator Resources</h2>
              <p>
                Use this page for free obituary generator, obituary generator, obituary creator, AI obituary generator, obituary writer, and obituary template generator resource links. For shorter copy-ready examples, use the <Link href="/short-obituary-examples/">short obituary examples</Link>. For phrase-bank language, use the <Link href="/obituary-wording/">obituary wording guide</Link>. For family review, use the <Link href="/obituary-checklist/">obituary checklist</Link>.
              </p>
            </div>
            <Link href="/free-obituary-generator/">{absoluteUrl("/free-obituary-generator/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Current Obituary Generator Search Landscape</h2>
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

          <section className="explainer-next" aria-labelledby="story-examples">
            <div>
              <div className="kicker">Longer stories</div>
              <h2 id="story-examples">Turn A Draft Into A Source-Backed Life Story</h2>
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
        Free obituary generator and source-backed obituary story resources. <Link href="/about/">Read the editorial method</Link>.
      </footer>
    </>
  );
}
