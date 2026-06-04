import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Short obituary examples and templates for newspaper notices, funeral-home pages, death announcements, private services, memorial donations, and longer online follow-up stories.";

const shortExamples = [
  {
    title: "Brief death notice",
    length: "40 to 60 words",
    text: "[Full name], [age], of [city], died on [date]. [Name] will be remembered for [one concrete role, habit, craft, or kindness]. [Name] is survived by [closest family]. Service details will be shared by [family, funeral home, or memorial page].",
    use: "Use this when a newspaper charges by the word, service details are not ready, or the family needs a clear first announcement.",
  },
  {
    title: "Standard short obituary",
    length: "100 to 150 words",
    text: "[Full name], [age], of [city], died on [date]. Born in [place], [Name] spent [his/her/their] life [working, teaching, serving, building, raising, caring, making, or leading] in [community or field]. [Name] loved [specific detail] and was known for [specific action]. [Name] is survived by [family list]. A [service type] will be held on [date] at [location].",
    use: "Use this for a complete but concise obituary that has room for one real life detail and public service information.",
  },
  {
    title: "Warm short obituary",
    length: "90 to 130 words",
    text: "[Full name] died on [date], leaving behind a family that will remember [one repeated scene: the kitchen table, garden, garage, classroom, route, song, or saying]. [Name] was [age] and lived in [city]. [Name] is survived by [family] and was preceded in death by [family, if included]. The family will gather [privately or at public service details].",
    use: "Use this when the family wants a short obituary that still feels like the person, not just a list of facts.",
  },
  {
    title: "Private service notice",
    length: "60 to 90 words",
    text: "[Full name], [age], died on [date]. [Name] was loved for [specific trait shown through action] and will be remembered by [family or community]. A private family service will be held. In place of public service details, the family asks friends to remember [Name] through [memory, charity, or quiet act].",
    use: "Use this when the death should be announced but service timing, addresses, or family availability should not be public.",
  },
  {
    title: "Memorial donation notice",
    length: "90 to 120 words",
    text: "[Full name], [age], of [city], died on [date]. [Name] spent [his/her/their] life [short life detail] and brought [specific quality] to [family, work, faith, neighborhood, or community]. [Name] is survived by [family]. In memory of [Name], gifts may be directed to [verified organization, fund, or mailing address].",
    use: "Use this when the family needs donation language in a short newspaper notice or funeral-home obituary.",
  },
  {
    title: "Short online memorial lead",
    length: "80 to 110 words",
    text: "[Full name] died on [date] at [age]. The printed notice can only hold the basics, but the fuller story begins with [scene, pressure point, work, place, or memory]. [Name] will be remembered for [specific detail]. A longer tribute, photographs, records, and source-backed memories can follow on the memorial page.",
    use: "Use this when print space is limited but the family wants a longer online obituary story, visual obituary, or memorial article later.",
  },
];

const printVsOnline = [
  {
    title: "Short print notice",
    text: "Lead with the facts readers need: full name, age, city, date of death, service details, and the safest memorial instruction. Cut broad praise before cutting names, dates, or verification details.",
  },
  {
    title: "Short funeral-home page",
    text: "Keep the opening clear, then add a warm detail that helps visitors recognize the person. Confirm whether the page will include a guestbook, donation link, livestream, or cemetery information.",
  },
  {
    title: "Short death announcement",
    text: "If the purpose is only to share the news, leave out complex biography and publish a fuller obituary once the family has verified names, memories, records, and service plans.",
  },
  {
    title: "Short lead for a longer story",
    text: "Use one exact image, object, room, route, phrase, or act of care as the bridge from a short notice into a longer online obituary story.",
  },
];

const shortEnoughChecks = [
  "The opening sentence identifies the person without making readers hunt for the name, age, city, or date.",
  "The obituary includes one concrete detail instead of three broad adjectives.",
  "Survivor and predeceased-family lists are checked with a family reviewer.",
  "Service details are either complete and public or intentionally withheld as private.",
  "Donation wording points to an official charity, memorial fund, family-support page, or mailing address.",
  "Private medical, address, financial, and conflict details are removed or generalized.",
  "The family has a plan for the longer online story if the print notice is too short to carry the tribute.",
];

const referenceLinks = [
  {
    label: "Legacy: simple and short obituary templates",
    href: "https://www.legacy.com/memorial-writing/simple-and-short-obituaries",
    note: "Current guide focused on short obituary purpose, structure, and template options.",
  },
  {
    label: "Memorials.com: short obituary examples",
    href: "https://www.memorials.com/info/how-to-write-an-obituary",
    note: "Includes short obituary formats and distinguishes brief notices from longer narrative obituaries.",
  },
  {
    label: "FuneralFolio: obituary templates",
    href: "https://www.funeralfolio.com/obituary-template",
    note: "Template bank with a specific short obituary template for newspapers, funeral homes, and online memorials.",
  },
  {
    label: "Ever Loved: short obituary templates and examples",
    href: "https://everloved.com/articles/obituaries-and-funeral-announcements/short-obituary-templates-and-examples/",
    note: "Short template guidance with survivor, predeceased-family, service, and private-service language.",
  },
  {
    label: "Everplans: death notice and obituary templates",
    href: "https://www.everplans.com/articles/death-notice-templates-and-obituary-templates",
    note: "Death notice and obituary template formats that help families decide how much detail belongs in a short notice.",
  },
  {
    label: "Dignity Memorial: death announcement guide",
    href: "https://www.dignitymemorial.com/grief-and-sympathy/losing-a-loved-one/how-to-write-a-death-announcement",
    note: "Family-facing guide for announcing a death through an obituary, digital message, or related channel.",
  },
];

export const metadata = {
  title: "Short Obituary Examples and Templates",
  description,
  keywords: [
    "short obituary examples",
    "short obituary template",
    "simple obituary examples",
    "brief obituary examples",
    "short death notice examples",
    "newspaper obituary examples",
  ],
  alternates: {
    canonical: "/short-obituary-examples/",
  },
  openGraph: {
    type: "article",
    title: `Short Obituary Examples and Templates | ${SITE_NAME}`,
    description,
    url: "/short-obituary-examples/",
  },
  twitter: {
    title: `Short Obituary Examples and Templates | ${SITE_NAME}`,
    description,
  },
};

export default function ShortObituaryExamplesPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const featured = comics.slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/short-obituary-examples/#article`,
        headline: "Short Obituary Examples and Templates",
        name: "Short Obituary Examples and Templates",
        url: absoluteUrl("/short-obituary-examples/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/short-obituary-examples/#webpage` },
        about: ["short obituary examples", "short obituary template", "simple obituary examples", "short death notice examples"],
        mainEntity: {
          "@type": "ItemList",
          name: "Short obituary examples and templates",
          itemListElement: shortExamples.map((example, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: example.title,
            description: `${example.length}: ${example.text} ${example.use}`,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/short-obituary-examples/#webpage`,
        name: "Short Obituary Examples and Templates",
        url: absoluteUrl("/short-obituary-examples/"),
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
      <main className="wrap section about-page explainer-page short-obituary-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Short obituary examples</div>
            <h1>Short Obituary Examples</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-wording/">Wording</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Story examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-checklist/">Checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-submit-an-obituary-to-a-newspaper/">Newspaper submission</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              A short obituary should still answer the public basics: who died, when, where they were connected, who should be named, whether services are public, and where memorial gifts should go. The difference is compression. Keep one specific life detail and move the fuller tribute to an online obituary, memorial page, or source-backed story.
            </p>
            <p>
              For many families, the best short obituary is not the shortest possible text. It is the shortest version that preserves accuracy, a recognizable human detail, and the next action readers need.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="short-examples">
            <div>
              <div className="kicker">Copy and adapt</div>
              <h2 id="short-examples">Short Obituary Examples By Use Case</h2>
            </div>
            <div className="worksheet-fields">
              {shortExamples.map((example) => (
                <section className="worksheet-box" key={example.title}>
                  <h3>{example.title}</h3>
                  <span>{example.length}</span>
                  <p>{example.text}</p>
                  <p><strong>Use when:</strong> {example.use}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-principles" aria-labelledby="print-online">
            <div>
              <div className="kicker">Format choice</div>
              <h2 id="print-online">Short Obituary, Death Notice, Or Online Story?</h2>
            </div>
            <div className="stories-intent-list">
              {printVsOnline.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="short-enough">
            <h2 id="short-enough">Final Check Before You Publish A Short Obituary</h2>
            <p>
              A short obituary can create more mistakes than a long one because every omitted detail feels intentional. Run this pass before the newspaper proof, funeral-home page, or family announcement goes live.
            </p>
            <ol className="writing-guide-list">
              {shortEnoughChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Short Obituary Resources</h2>
              <p>
                Use this page for short obituary examples, short obituary templates, simple obituary examples, brief death notices, newspaper word-limit resources, and funeral-home pages that help families write a concise notice. For phrase-bank language, use the <Link href="/obituary-wording/">obituary wording examples</Link>. For a full story structure, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For narrative examples, use the <Link href="/obituary-examples/">obituary examples page</Link>. For paid print decisions, use the <Link href="/obituary-cost/">obituary cost guide</Link>.
              </p>
            </div>
            <Link href="/short-obituary-examples/">{absoluteUrl("/short-obituary-examples/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Related Short Obituary Guidance</h2>
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
              <div className="kicker">Longer stories</div>
              <h2 id="examples">Move From A Short Notice To A Source-Backed Story</h2>
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
        Short obituary examples with a path to fuller stories. <Link href="/about/">Read the editorial method</Link>.
      </footer>
    </>
  );
}
