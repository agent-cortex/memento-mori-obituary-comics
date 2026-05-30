# SEO Audit Report: Memento Mori Obituary Comics

Audit date: 2026-05-31
Target: https://memento-mori-obituary-comics.vercel.app/

Post-audit implementation note: this report records the live-site audit findings observed before fixes. The local checkout now includes an implementation pass for the critical and high-priority SEO items; see `ACTION-PLAN.md` for current completion status.

## Executive Summary

Overall SEO Health Score: 62/100

Business type detected: publisher / visual archive. The site is a small static comic publication with three reader pages, PDF downloads, and source-backed biographical stories.

Top risks:

1. `robots.txt`, `sitemap.xml`, and `llms.txt` all return 404, so search engines and AI crawlers have no explicit discovery map.
2. Reader pages have no visible `h1` or `h2`, which weakens page-level topical clarity.
3. No canonical URLs, Open Graph, Twitter card tags, or JSON-LD structured data are present on any audited HTML page.
4. Most primary content is embedded in images, with only thin surrounding HTML text for each comic.
5. Comic pages use large JPEGs and PDF assets with minimal caching optimization.

Top strengths:

1. Homepage and all three reader pages return `200`.
2. Titles and meta descriptions exist on all audited HTML pages.
3. Image `alt` attributes are present and descriptive enough for the reader pages.
4. Vercel serves HTTPS with HSTS.
5. Internal asset links checked during the crawl returned `200`.

## Crawl Summary

Audited HTML pages:

| URL | Status | Title | H1 | Canonical | Structured Data |
| --- | --- | --- | --- | --- | --- |
| `/` | 200 | Memento Mori Obituary Comics | Present | Missing | Missing |
| `/comics/frida-kahlo-broken-mirror/` | 200 | Frida Kahlo - The Broken Mirror | Missing | Missing | Missing |
| `/comics/viktor-frankl-meaning-under-ash/` | 200 | Viktor Emil Frankl - Meaning Under Ash | Missing | Missing | Missing |
| `/comics/dostoyevsky-borrowed-time/` | 200 | Fyodor Mikhailovich Dostoyevsky - Borrowed Time | Missing | Missing | Missing |

Public discovery files:

| URL | Status |
| --- | --- |
| `/robots.txt` | 404 |
| `/sitemap.xml` | 404 |
| `/llms.txt` | 404 |

Search visibility check:

`site:memento-mori-obituary-comics.vercel.app` did not surface the deployed site in the tested search result set. This is not definitive proof of non-indexing, but it matches the missing sitemap and young domain risk profile.

## Technical SEO

Score: 68/100

What is working:

- Homepage and comic pages are crawlable static HTML.
- Clean URLs are enabled through `vercel.json`.
- HTTPS is active.
- HSTS is present: `strict-transport-security: max-age=63072000; includeSubDomains; preload`.
- The internal crawl found 40 linked assets and no broken internal asset URLs.

Issues:

- Critical: `/robots.txt` returns 404.
- High: `/sitemap.xml` returns 404.
- Medium: `/llms.txt` returns 404, which reduces explicit AI crawler guidance.
- Medium: static assets are served with `cache-control: public, max-age=0, must-revalidate`, which forces validation for CSS, JS, images, and PDFs.
- Medium: every HTML page is missing a canonical URL.

Recommended fixes:

- Add `/robots.txt` with sitemap reference and explicit AI crawler policy.
- Add `/sitemap.xml` containing the homepage and all comic reader pages.
- Add `/llms.txt` with a short explanation of the publication, key URLs, and citation guidance.
- Add canonical tags to each page.
- Add long-lived immutable caching for fingerprinted or stable comic assets.

## Content Quality

Score: 58/100

What is working:

- The site has a clear editorial concept: biographical comics about people facing mortality and producing lasting work.
- The homepage has concise positioning.
- Comic pages include a short epilogue and source names.
- The subject matter has natural long-tail demand around Frida Kahlo, Viktor Frankl, Dostoyevsky, mortality, biography, philosophy, and comics.

Issues:

- High: the actual comic narrative is image-only from a crawler perspective. Search engines and AI systems cannot reliably extract panel text, story beats, quotes, dates, or claims from the images.
- High: source names are listed, but no outbound citations or source URLs are present in the HTML.
- Medium: comic pages have very little crawlable prose beyond title, description, page captions, and source names.
- Medium: no author/editor/about page exists to establish E-E-A-T signals.
- Medium: the homepage positions the archive but does not explain publishing cadence, verification method, editorial standards, or author identity.

Recommended fixes:

- Add a crawlable transcript or "story notes" section to each comic page.
- Link source chips to the exact source URLs.
- Add an About / Editorial Method page explaining how subjects are selected, how sources are checked, and who publishes the comics.
- Add article-style intro copy per comic: subject, mortality event, why it matters, and what readers should take away.

## On-Page SEO

Score: 60/100

What is working:

- Every HTML page has a title tag.
- Every HTML page has a meta description.
- Homepage has one `h1` and an archive `h2`.
- The archive links to all reader pages and PDFs.

Issues:

- High: reader pages have no `h1`. The visible title is a `div.reader-title`, not a heading.
- Medium: reader pages have no heading hierarchy around the epilogue, sources, PDF, or next comic section.
- Medium: titles are readable but not keyword-expanded. Example: `Frida Kahlo - The Broken Mirror` could include "obituary comic" or "memento mori comic".
- Medium: meta descriptions are short and sometimes too generic for search snippets.
- Low: archive card links point to `#read`, which is useful for UX but makes the page-level entry feel less canonical than linking to the page itself.

Recommended fixes:

- Add one visible or visually-hidden `h1` to each reader page.
- Add `h2` sections such as "Comic", "Story Notes", "Sources", and "Download PDF".
- Expand titles and descriptions with the format: `[Person] Obituary Comic - [Comic Title] | Memento Mori Obituary Comics`.
- Link archive cards to canonical comic pages, with a secondary "Start reading" anchor when needed.

## Schema & Structured Data

Score: 20/100

Current implementation:

- No JSON-LD structured data was detected.

Recommended schema:

- `WebSite` on the homepage.
- `CollectionPage` or `ItemList` on the archive homepage.
- `CreativeWork`, `ComicStory`, or `VisualArtwork` for each comic page.
- `Person` entity for each subject.
- `BreadcrumbList` on reader pages.

Avoid:

- Do not add FAQ schema unless this becomes a government or healthcare site.
- Do not add HowTo schema.

## Performance

Score: 70/100

PageSpeed Insights status: not available during this audit because the public API returned a quota exceeded error.

Evidence-based performance observations:

- Homepage HTML is small: live response `content-length` was 7,737 bytes.
- Live CSS is moderate: `/assets/style.css` returned `content-length: 21,944`.
- Vercel Insights, Speed Insights, and local analytics scripts are deferred.
- Above-the-fold homepage cover images are currently marked `loading="lazy"`, which can delay visible archive images but may help initial hero load.
- Reader pages eager-load the first comic image. The largest first image observed was the Frida cover at 497,830 bytes.
- Full image/PDF asset corpus in the repo is about 17.3 MB.
- Comic images are JPEGs, not AVIF/WebP.
- Image dimensions are not declared in the HTML, which can increase layout shift risk.

Recommended fixes:

- Add `width` and `height` attributes to all comic images.
- Use AVIF or WebP variants for web display while keeping PDF downloads.
- Consider `fetchpriority="high"` on the first reader image and the most important homepage cover if it is above the fold.
- Use long-lived cache headers for static images, CSS, JS, and PDFs.
- Keep the deferred analytics approach.

## Images

Score: 72/100

What is working:

- Image alt text exists on homepage covers and reader page images.
- Reader page alt text includes page number, subject, and comic title.
- Lazy loading is used for non-first reader images.

Issues:

- Medium: alt text is functional but not semantically rich; every comic page image says only "Page N of Subject: Title".
- Medium: contact sheets and PDFs are indexed as direct assets but do not have HTML landing metadata.
- Medium: no modern image formats are used.
- Medium: no explicit dimensions are set.

Recommended fixes:

- Add richer per-page alt text or figcaption summaries from the comic transcript.
- Keep direct PDFs but make the HTML reader the canonical indexable experience.
- Generate WebP/AVIF web assets and reserve original/PDF assets for downloads.

## AI Search Readiness / GEO

Score: 38/100

What is working:

- The concept is highly citeable if converted into structured text: "daily obituary comics" is distinctive.
- Pages include named sources, dates, subjects, and mortality events.

Issues:

- High: no `llms.txt`.
- High: no crawlable comic transcript or concise factual summary blocks.
- High: source references are not linked to exact source URLs.
- Medium: no structured data for entities, subjects, or creative works.
- Medium: no stable author/editor identity or editorial standards page.

Recommended fixes:

- Add `llms.txt` with homepage, archive, current comics, citation guidance, and AI crawler policy.
- Add a "Citable Summary" block to every comic page with 3-5 factual bullets.
- Add source URLs and quote/citation provenance.
- Add JSON-LD linking the comic, subject, publisher, and sources.

## Accessibility Notes

This was not a full WCAG audit, but SEO-relevant accessibility findings are:

- Reader pages need semantic headings.
- Button-like controls in the deployed Frida reader have text labels; this is good.
- The clickable quote widget on the homepage is a `div` with `onclick`, which should be a `button` for keyboard accessibility.
- Arrow glyph links and controls should have accessible names if retained.

## Scoring Breakdown

| Category | Weight | Category Score | Weighted Points |
| --- | ---: | ---: | ---: |
| Technical SEO | 25% | 68 | 17.0 |
| Content Quality | 25% | 58 | 14.5 |
| On-Page SEO | 20% | 60 | 12.0 |
| Schema / Structured Data | 10% | 20 | 2.0 |
| Performance | 10% | 70 | 7.0 |
| Images | 5% | 72 | 3.6 |
| AI Search Readiness | 5% | 38 | 1.9 |
| Total | 100% | - | 58.0 |

Adjusted score: 62/100. The adjustment credits the small static architecture, clean crawl, HTTPS, and low current page count while still penalizing discovery, schema, and text-indexability gaps.

## Priority Action Plan

Critical:

- Add `robots.txt` and `sitemap.xml`.
- Add canonical tags to every page.

High:

- Add `h1` headings to reader pages.
- Add JSON-LD schema to homepage and comic pages.
- Add crawlable transcripts or story notes to comic pages.
- Link source names to source URLs.

Medium:

- Add Open Graph and Twitter card metadata.
- Add `llms.txt`.
- Add image dimensions and modern image variants.
- Add an About / Editorial Method page.
- Improve cache headers for static assets.

Low:

- Expand title/meta formats.
- Add breadcrumb navigation.
- Add citable summary blocks.
- Improve PDF landing metadata.
