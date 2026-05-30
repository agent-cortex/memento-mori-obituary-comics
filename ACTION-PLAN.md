# SEO Action Plan

Target: https://memento-mori-obituary-comics.vercel.app/
Audit date: 2026-05-31

## Implementation Status

Completed in this pass:

- Added `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Added canonical, Open Graph, Twitter card, and JSON-LD metadata to generated pages.
- Added an `/about/` editorial method page and linked it from the homepage.
- Added semantic reader-page `h1` headings plus crawlable `Citable Summary`, `Story Notes`, `Sources`, and `Download PDF` sections.
- Converted source names into linked citations in `comics.json` and per-comic `comic.json` files.
- Added page-level alt/caption summaries and image `width`/`height` attributes.
- Added renderer tests so future generated comics keep the SEO baseline.

Still open:

- Generate WebP/AVIF display variants for comic images.
- Add long-lived cache headers for stable static assets.
- Replace the remaining source summaries with fuller panel transcripts if the original panel text should be indexable verbatim.
- Deploy the updated static site to production.

## Critical

1. Add `robots.txt`. Completed.
   - Include `Sitemap: https://memento-mori-obituary-comics.vercel.app/sitemap.xml`.
   - Explicitly allow normal search crawlers unless there is a reason not to.
   - Decide whether AI crawlers such as GPTBot, ClaudeBot, PerplexityBot, and Google-Extended should be allowed.

2. Add `sitemap.xml`. Completed.
   - Include `/`.
   - Include each comic reader page.
   - Use `lastmod` from `published_at` or file update dates.

3. Add canonical tags. Completed.
   - Homepage: `https://memento-mori-obituary-comics.vercel.app/`
   - Comic pages: full trailing-slash reader URLs.

## High

4. Add semantic headings to reader pages. Completed.
   - Each comic page should have exactly one `h1`.
   - Recommended text: `[Person] - [Comic Title]`.
   - Add `h2` sections for `Comic`, `Story Notes`, `Sources`, and `Download PDF`.

5. Add structured data. Completed.
   - Homepage: `WebSite` plus `CollectionPage`/`ItemList`.
   - Comic pages: `CreativeWork` or `ComicStory`, `Person`, and `BreadcrumbList`.
   - Include publisher name, URL, image, date published, description, subject person, and source URLs.

6. Add crawlable text for each comic. Partially completed.
   - Minimum viable version: 3-5 paragraph story note below the reader.
   - Better version: panel transcript or page-by-page summary.
   - Best version: citable summary, transcript, source notes, and related works.

7. Replace source-name-only citations with source links. Completed.
   - Store source URLs in each `comic.json`.
   - Render source chips as links.
   - Prefer exact article/entity URLs over homepage-level source links.

## Medium

8. Add social metadata. Completed.
   - `og:title`, `og:description`, `og:type`, `og:url`, `og:image`.
   - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
   - Use each comic cover as the share image.

9. Add `llms.txt`. Completed.
   - Explain the site in one paragraph.
   - List canonical pages and current comics.
   - Include citation preference and source policy.

10. Improve image delivery. Partially completed.
   - Add `width` and `height` attributes.
   - Generate AVIF/WebP for reader display.
   - Keep JPEG/PDF downloads as fallbacks.
   - Consider `fetchpriority="high"` for the first reader image.

11. Improve cache headers. Not started.
   - Give static image/PDF/CSS/JS assets long-lived cache headers.
   - Use immutable caching only when filenames are content-stable or fingerprinted.

12. Add an About / Editorial Method page. Completed.
   - Explain authorship, publishing cadence, verification approach, source standards, and contact.
   - Link it from the homepage and footer.

## Low

13. Expand title and description templates. Completed.
   - Homepage title: `Memento Mori Obituary Comics - Daily Biographical Comics About Mortality and Work`.
   - Comic title pattern: `[Person] Obituary Comic - [Title] | Memento Mori Obituary Comics`.

14. Add breadcrumbs. Completed in JSON-LD.
   - Homepage > Comics > Person / Comic Title.
   - Render visually or as structured data at minimum.

15. Make the homepage quote widget keyboard-accessible. Not applicable to the current local static source; the deployed page appears to include newer UI not present in this checkout.
   - Use a `button` instead of `div onclick`.
   - Preserve current visual styling.

16. Prefer canonical comic page links in archive cards. Completed.
   - Link card covers to `/comics/[slug]/`.
   - Keep a secondary "Start reading" link to `#read`.

## Suggested Implementation Order

1. Ship discovery files: `robots.txt`, `sitemap.xml`, `llms.txt`.
2. Add canonical/social metadata and schema generation from `comics.json`.
3. Add reader headings and source URLs.
4. Add transcripts or story notes.
5. Optimize images and cache headers.
6. Add the About / Editorial Method page.
