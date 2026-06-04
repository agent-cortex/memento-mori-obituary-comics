import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A printable obituary story worksheet for gathering facts, memories, records, scenes, and citations before writing a sourced life story.";

const worksheetSections = [
  {
    title: "Essential facts",
    fields: [
      "Full legal name, preferred name, and name spellings",
      "Birth date, birth place, death date, and death place",
      "Immediate family, caregivers, community, and service details",
      "Education, work, military service, faith, clubs, awards, and affiliations",
    ],
  },
  {
    title: "Evidence trail",
    fields: [
      "Obituary, death notice, funeral-home page, or memorial program",
      "Public records, newspaper clips, letters, photographs, and family documents",
      "Names or facts that still need confirmation",
      "Claims that should be written as memory instead of documented fact",
    ],
  },
  {
    title: "Defining scene",
    fields: [
      "One moment that shows the person in action",
      "A place, object, tool, recipe, route, room, uniform, or photograph tied to the story",
      "What changed because this person was there",
      "A quote, habit, gesture, or repeated phrase people still remember",
    ],
  },
  {
    title: "Dignity check",
    fields: [
      "Private details to leave out",
      "Medical, family, address, or conflict details that need consent",
      "Readers who must recognize the story as fair",
      "What the obituary should help future readers understand",
    ],
  },
];

const shortFrame = [
  "Start with the verified death notice facts.",
  "Add the life context that helps a stranger understand the person.",
  "Choose one scene or detail that carries the story.",
  "Name what remains: people, work, care, records, habits, places, or memory.",
  "Close with practical service, donation, or memorial details when needed.",
];

export const metadata = {
  title: "Printable Obituary Story Worksheet",
  description,
  keywords: [
    "obituary story worksheet",
    "obituary writing worksheet",
    "printable obituary worksheet",
    "obituary writing prompts",
    "life story obituary worksheet",
    "family history obituary worksheet",
  ],
  alternates: {
    canonical: "/obituary-story-worksheet/",
  },
  openGraph: {
    type: "article",
    title: `Printable Obituary Story Worksheet | ${SITE_NAME}`,
    description,
    url: "/obituary-story-worksheet/",
  },
  twitter: {
    title: `Printable Obituary Story Worksheet | ${SITE_NAME}`,
    description,
  },
};

export default function ObituaryStoryWorksheetPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/obituary-story-worksheet/#worksheet`,
        name: "Printable Obituary Story Worksheet",
        headline: "Printable Obituary Story Worksheet",
        url: absoluteUrl("/obituary-story-worksheet/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-04",
        dateModified: "2026-06-04",
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: ["obituary writing", "obituary story", "family history", "life story writing"],
        mainEntity: {
          "@type": "ItemList",
          name: "Obituary story worksheet sections",
          itemListElement: worksheetSections.map((section, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: section.title,
            description: section.fields.join("; "),
          })),
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/obituary-story-worksheet/#webpage`,
        name: "Printable Obituary Story Worksheet",
        url: absoluteUrl("/obituary-story-worksheet/"),
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
      <main className="wrap section about-page explainer-page worksheet-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Printable worksheet</div>
            <h1>Obituary Story Worksheet</h1>
            <p>{description}</p>
            <div className="stories-actions worksheet-actions">
              <Button asChild variant="primary">
                <Link href="/how-to-write-an-obituary-story/">Read the writing guide</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-writing-prompts/">Writing prompts</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-stories/">See story examples</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-examples/">Obituary examples</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="worksheet-purpose">
            <h2 id="worksheet-purpose">Before Writing</h2>
            <p>
              Use this worksheet before drafting an obituary story, memorial article, family-history note, or visual obituary. It separates verified facts from remembered details so the final piece can be warm without becoming vague or inaccurate.
            </p>
          </section>

          <section className="worksheet-grid" aria-labelledby="worksheet-fields">
            <div>
              <div className="kicker">Worksheet</div>
              <h2 id="worksheet-fields">Gather The Story</h2>
            </div>
            <div className="worksheet-fields">
              {worksheetSections.map((section) => (
                <section className="worksheet-box" key={section.title}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.fields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  <div className="worksheet-lines" aria-label={`${section.title} notes`}>
                    <span />
                    <span />
                    <span />
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="short-frame">
            <h2 id="short-frame">Five-Line Draft Frame</h2>
            <ol className="writing-guide-list">
              {shortFrame.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="about-card stories-link-box worksheet-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Worksheet Pages</h2>
              <p>
                Use this page for library resource lists, funeral-home planning resources, genealogy prompts, grief-writing guides, and classroom worksheets. For prompt banks and legacy interview resources, use the <Link href="/obituary-writing-prompts/">obituary writing prompts page</Link>. For copyable formats, use the <Link href="/life-story-obituary-template/">life story obituary template</Link>. For sample structures, use the <Link href="/obituary-examples/">obituary examples page</Link>. For the longer explanation, use the <Link href="/how-to-write-an-obituary-story/">obituary story writing guide</Link>.
              </p>
            </div>
            <Link href="/obituary-story-worksheet/">{absoluteUrl("/obituary-story-worksheet/")}</Link>
          </section>
        </article>
      </main>
      <footer>
        Practical obituary writing resources. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
