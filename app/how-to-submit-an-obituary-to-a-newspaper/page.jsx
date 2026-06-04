import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { comicPath, getComics, sourceItems } from "@/lib/comics";
import { absoluteUrl, publisherSchema, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "A practical checklist for submitting or placing an obituary in a newspaper: where to send it, proof of death, deadlines, costs, photos, funeral-home verification, and final proof review.";

const submissionSteps = [
  {
    title: "Choose the publication first",
    text: "Pick the local newspaper, hometown paper, alumni magazine, trade publication, or online obituary partner before you write the final version. Each publisher sets its own word limits, deadlines, proofing rules, and photo requirements.",
  },
  {
    title: "Find the obituary or classifieds desk",
    text: "Look for an Obituaries, Death Notices, Classifieds, or Place an Obituary link on the newspaper site. If there is no form, contact the editor or advertising/classifieds desk and ask how family-submitted notices are handled.",
  },
  {
    title: "Ask who should submit",
    text: "Some newspapers prefer funeral-home submissions because the funeral home can verify the death, manage billing, and coordinate deadlines. If the family submits directly, ask what proof or authorization the paper needs.",
  },
  {
    title: "Prepare proof of death",
    text: "Common verification paths include funeral-home or crematory contact information, a death certificate, coroner or medical examiner information, or another published official notice. Do not wait until the deadline to ask what the paper accepts.",
  },
  {
    title: "Check price, length, and photo rules",
    text: "Paid notices are often priced by word, line, column inch, photo, icon, publication day, or print-plus-online package. Ask for a quote before approving publication, especially if the obituary is long or includes multiple photos.",
  },
  {
    title: "Review the proof before it runs",
    text: "Check spelling, dates, service times, relationships, donation links, and privacy-sensitive details. Save the final proof, receipt, publication date, URL, and newspaper name for family records and future genealogy citations.",
  },
];

const requiredItems = [
  {
    label: "Submitter information",
    details: "Full name, phone, email, relationship to the deceased, billing contact, and whether a funeral home is also submitting.",
  },
  {
    label: "Deceased person's public details",
    details: "Name as it should appear, age or dates, city or town, date of death, and the version of any nickname, maiden name, suffix, or middle name.",
  },
  {
    label: "Verification details",
    details: "Funeral home, crematory, coroner, death certificate, prior official notice, or another proof path accepted by the newspaper.",
  },
  {
    label: "Publication request",
    details: "Requested publication date, print or online placement, number of days, deadline, whether Sunday or holiday rules apply, and whether a proof is required.",
  },
  {
    label: "Obituary copy",
    details: "A clean draft with service details, survivors, donations, and any links already checked for accuracy, privacy, and scam risk.",
  },
  {
    label: "Photo file",
    details: "A clear portrait or approved image in the format and resolution the newspaper requests, usually cropped to focus on the deceased.",
  },
];

const mistakes = [
  "Do not submit directly if the funeral home is already submitting the same obituary.",
  "Do not assume the paper will publish before services unless you checked the daily, weekend, and holiday deadlines.",
  "Do not approve a quote until you understand word, line, column-inch, photo, online, and extra-day charges.",
  "Do not use a low-resolution web photo if the newspaper requires a print-quality image.",
  "Do not include home addresses, full birth dates, financial details, or unverified donation links without a privacy review.",
  "Do not share a copied obituary result until you verify that it came from the newspaper, funeral home, or another official source.",
];

const referenceLinks = [
  {
    label: "Legacy.com: how to submit an obituary online",
    href: "https://www.legacy.com/memorial-writing/how-to-submit-an-obituary-online",
    note: "Overview of submitting obituary or death notice copy online, through newspapers, and through funeral homes.",
  },
  {
    label: "Everplans: submit a death notice or obituary",
    href: "https://www.everplans.com/articles/how-to-submit-a-death-notice-or-an-obituary-to-a-newspaper-or-website",
    note: "Explains newspaper submission paths, funeral-home submission, and local papers without a dedicated obituary desk.",
  },
  {
    label: "The Gazette: submit an obituary",
    href: "https://www.thegazette.com/obituaries/submit-an-obituary/",
    note: "Example newspaper policy with email/in-person submission, prepayment, deadline, proofing, funeral-home verification, and photo pricing.",
  },
  {
    label: "The Dominion Post: obituary submission",
    href: "https://www.dominionpost.com/contact/submit-announcement/submit-obituary/",
    note: "Example newspaper policy covering funeral-home submissions, family authorization, proof of death, deadlines, pricing, and photo requirements.",
  },
  {
    label: "Anchorage Daily News: obituary information",
    href: "https://obituaries.adn.com/adportal/obits/info/pricing.htm",
    note: "Example policy covering online/email submission, funeral-home recommendation, verification of death, print schedule, pricing, and photo options.",
  },
  {
    label: "The Martha's Vineyard Times: obituary submission",
    href: "https://www.mvtimes.com/contact-2/obituary-submission/page/3462/",
    note: "Example community-newspaper policy covering free publication, minimum information, verification contacts, deadlines, and editing.",
  },
  {
    label: "Legacy.com: Press Democrat obituary placement",
    href: "https://www.legacy.com/Obituaries.asp?NewspaperID=101&Page=PlaceAnObituary",
    note: "Example partner placement page showing death verification, final cost quote approval, deadlines, and photo criteria.",
  },
];

export const metadata = {
  title: "How to Submit an Obituary to a Newspaper",
  description,
  keywords: [
    "how to submit an obituary to a newspaper",
    "submit obituary to newspaper",
    "place an obituary",
    "newspaper obituary submission",
    "obituary submission guidelines",
    "how to place an obituary in a newspaper",
  ],
  alternates: {
    canonical: "/how-to-submit-an-obituary-to-a-newspaper/",
  },
  openGraph: {
    type: "article",
    title: `How to Submit an Obituary to a Newspaper | ${SITE_NAME}`,
    description,
    url: "/how-to-submit-an-obituary-to-a-newspaper/",
  },
  twitter: {
    title: `How to Submit an Obituary to a Newspaper | ${SITE_NAME}`,
    description,
  },
};

export default function NewspaperObituarySubmissionPage() {
  const comics = getComics();
  const latestDate = comics.reduce((max, comic) => (comic.published_at > max ? comic.published_at : max), "2026-06-05");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      publisherSchema(),
      {
        "@type": "Article",
        "@id": `${SITE_URL}/how-to-submit-an-obituary-to-a-newspaper/#article`,
        headline: "How to Submit an Obituary to a Newspaper",
        name: "How to Submit an Obituary to a Newspaper",
        url: absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/"),
        description,
        inLanguage: SITE_LANGUAGE,
        datePublished: "2026-06-05",
        dateModified: latestDate,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${SITE_URL}/how-to-submit-an-obituary-to-a-newspaper/#webpage` },
        about: ["newspaper obituary submission", "place an obituary", "death notice submission", "obituary verification"],
        mainEntity: {
          "@type": "ItemList",
          name: "Newspaper obituary submission checklist",
          itemListElement: submissionSteps.map((step, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: step.title,
            description: step.text,
          })),
        },
        citation: referenceLinks.map((reference) => reference.href),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/how-to-submit-an-obituary-to-a-newspaper/#webpage`,
        name: "How to Submit an Obituary to a Newspaper",
        url: absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/"),
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
      <main className="wrap section about-page explainer-page newspaper-submission-page">
        <article>
          <header className="about-header-section explainer-header-section">
            <div className="kicker">Newspaper obituary submission</div>
            <h1>How To Submit An Obituary To A Newspaper</h1>
            <p>{description}</p>
            <div className="stories-actions">
              <Button asChild variant="primary">
                <Link href="/obituary-vs-death-notice/">Notice explainer</Link>
              </Button>
              <Button asChild>
                <Link href="/obituary-cost/">Cost guide</Link>
              </Button>
              <Button asChild>
                <Link href="/life-story-obituary-template/">Template</Link>
              </Button>
              <Button asChild>
                <Link href="/what-not-to-include-in-an-obituary/">Privacy checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/memorial-donation-wording-obituary/">Donation wording</Link>
              </Button>
              <Button asChild>
                <Link href="/fake-obituary-sites/">Fake site checklist</Link>
              </Button>
              <Button asChild>
                <Link href="/how-to-write-an-obituary-story/">Writing guide</Link>
              </Button>
            </div>
          </header>

          <section className="explainer-body" aria-labelledby="quick-answer">
            <h2 id="quick-answer">Quick Answer</h2>
            <p>
              To submit an obituary to a newspaper, find the paper's Obituaries, Death Notices, Classifieds, or Place an Obituary page, then follow that publication's form, email, phone, or funeral-home submission process. Most newspapers need the obituary text, submitter contact details, requested publication date, payment approval, and a way to verify the death before publication.
            </p>
            <p>
              The safest workflow is to check the newspaper's rules before writing the final version. Confirm the deadline, price, word or line limit, photo format, verification requirement, proofing process, and whether the funeral home should submit on the family's behalf. For quote questions before payment, use the <Link href="/obituary-cost/">obituary cost guide</Link>.
            </p>
          </section>

          <section className="explainer-principles" aria-labelledby="steps">
            <div>
              <div className="kicker">Submission workflow</div>
              <h2 id="steps">Six Steps Before You Place The Obituary</h2>
            </div>
            <div className="stories-intent-list">
              {submissionSteps.map((step) => (
                <article key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="worksheet-grid" aria-labelledby="required">
            <div>
              <div className="kicker">What to gather</div>
              <h2 id="required">Information Newspapers Often Ask For</h2>
            </div>
            <div className="worksheet-fields">
              {requiredItems.map((item) => (
                <section className="worksheet-box" key={item.label}>
                  <h3>{item.label}</h3>
                  <p>{item.details}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="explainer-body" aria-labelledby="mistakes">
            <h2 id="mistakes">Avoid These Submission Mistakes</h2>
            <ul className="writing-guide-list">
              {mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-card stories-link-box" aria-labelledby="best-link">
            <div>
              <h2 id="best-link">Best Link Target For Newspaper Obituary Submission Pages</h2>
              <p>
                Use this page for newspaper help pages, funeral-home planning pages, community-newspaper instructions, obituary cost explainers, and articles about how to place or submit an obituary. For line fees, photos, print-plus-online packages, and funeral-home cash advances, use the <Link href="/obituary-cost/">obituary cost guide</Link>. For the difference between a paid notice and a fuller life story, use the <Link href="/obituary-vs-death-notice/">obituary vs death notice explainer</Link>. For memorial contribution language before submission, use the <Link href="/memorial-donation-wording-obituary/">memorial donation wording guide</Link>. For safer wording before publication, use the <Link href="/what-not-to-include-in-an-obituary/">obituary privacy checklist</Link>. For suspicious obituary results after publication, use the <Link href="/fake-obituary-sites/">fake obituary sites checklist</Link>. For a fuller draft, use the <Link href="/life-story-obituary-template/">life story obituary template</Link> and <Link href="/how-to-write-an-obituary-story/">obituary story writing guide</Link>.
              </p>
            </div>
            <Link href="/how-to-submit-an-obituary-to-a-newspaper/">{absoluteUrl("/how-to-submit-an-obituary-to-a-newspaper/")}</Link>
          </section>

          <section className="explainer-next" aria-labelledby="references">
            <div>
              <div className="kicker">References</div>
              <h2 id="references">Sources And Example Newspaper Policies</h2>
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
        Check the newspaper's rules before approving publication. <Link href="/press/">Press and review resources</Link>.
      </footer>
    </>
  );
}
