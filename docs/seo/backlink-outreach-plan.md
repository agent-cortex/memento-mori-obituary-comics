# Backlink Outreach Plan

Date: 2026-06-04
Canonical host: https://www.finalnotes.page/
Primary goal: earn relevant editorial links that help the obituary comics archive reach page one for obituary-comics, obituary stories, visual biography, grief comics, and source-backed biography searches.

## Current Baseline

- Live non-www host redirects to `https://www.finalnotes.page/`.
- This pass normalizes the app default canonical URL to `https://www.finalnotes.page/`.
- Live sitemap and robots were reachable during the check, but live `/llms.txt` returned a production 500 before this pass.
- Web search checks surfaced the Reddit post about FinalNotes, but did not surface canonical `finalnotes.page` pages for exact brand/site queries in the sampled results.

## Link Rules

- Do not buy backlinks that pass ranking credit.
- Do not use low-quality directories, bookmark sites, automated link creation, footer/sidebar links, or link exchanges.
- Do not ask for exact-match spam anchors like "best obituary" or "top obituary site".
- Ask for editorial coverage, review consideration, resource inclusion, or a natural citation because the page helps that publication's readers.
- Use descriptive, natural anchors: `Memento Mori Obituary Comics`, `obituary comics archive`, `source-backed visual biographies`, `visual obituary comics`, or the subject-specific title.

## Link Targets

| Use case | URL | Recommended anchor |
| --- | --- | --- |
| Broad coverage | https://www.finalnotes.page/ | Memento Mori Obituary Comics |
| Obituary story keywords | https://www.finalnotes.page/obituary-stories/ | obituary stories and articles |
| Press, reviewers, educators | https://www.finalnotes.page/press/ | obituary comics resource page |
| Source standards | https://www.finalnotes.page/about/ | editorial method |
| Latest issue | https://www.finalnotes.page/comics/solzhenitsyn-gulag-witness/ | Aleksandr Solzhenitsyn obituary comic |
| Holocaust/literature angle | https://www.finalnotes.page/comics/primo-levi/ | Primo Levi obituary comic |
| Art/mortality angle | https://www.finalnotes.page/comics/henri-matisse-second-life/ | Henri Matisse second life comic |
| Grief/meaning angle | https://www.finalnotes.page/comics/viktor-frankl-meaning-under-ash/ | Viktor Frankl obituary comic |

## Tier 1 Targets

| Target | Why it fits | Ask | Target URL |
| --- | --- | --- | --- |
| Modern Loss | Accepts pitches about death, loss, grief, and multimedia including cartoons/illustrations. | Pitch a 700-800 word reported/personal essay about what changes when an obituary becomes a comic. | `/press/` or a subject page |
| Beyond the Dash | Obituary writing and life-story platform that invites original guest blog posts. | Guest article: "How to Turn an Obituary Into a Visual Life Story." | `/` and `/about/` |
| The Comics Journal | Comics-first criticism with formal pitch path and PDF review acceptance. | Essay pitch about the obituary as a comics form, or review/news tip if the project is editorially relevant. | `/press/` |
| SOLRAD | Literary comics publication focused on criticism, essays, interviews, and small press work. | Essay/interview pitch on source-backed obituary comics as visual biography. | `/press/` |
| Graphic Medicine | Covers comics around illness, care, death, grief, and medical narratives. | Ask for review/spotlight consideration, especially around illness, mortality, and source trails. | Subject pages |
| Comics Beat | Comics news and review audience; accepts tips/news items by email. | Short news tip: new daily obituary-comics archive with source-backed reader pages. | `/` |
| The Nib | Publishes comics and pitches in comics form. | Pitch a short original comic about obituary as a form, linking back through author/context if accepted. | `/press/` |
| Broken Frontier | Strong indie/small-press comics relevance and accepts review requests. | Conditional only: do not pitch if any comic art used generative AI, because their stated review policy rejects gen-AI art. | `/press/` |

## Tier 2 Resource and Community Targets

| Target group | Why it fits | Ask |
| --- | --- | --- |
| Sequential Artists Workshop | Runs grief, graphic memoir, graphic medicine, and death-in-comics programming. | Share `/press/` as a resource and offer a short prompt/case study for students. |
| Library and university comics guides | Often maintain graphic medicine, biography comics, and grief comics resource lists. | Ask for resource inclusion after building a longer educator note or PDF. |
| Genealogy and obituary-writing newsletters | Users care about life-story preservation and memorable obituary forms. | Offer a practical article with examples and link to `/about/` for source standards. |
| Substack writers on grief, deathcare, biographies, and comics | Relevant audience, easier editorial access, natural newsletter links. | Offer a concise guest note or interview using `/press/` as the reference URL. |
| Reddit communities | Good discovery, usually nofollow, not a ranking-link play. | Continue careful feedback posts in relevant threads only when allowed and not promotional. |

## Avoid

- Paid guest-post marketplaces and pages that openly sell link insertion.
- Generic "write for us" sites with no topical relevance to comics, grief, obituary writing, biography, libraries, or deathcare.
- Article farms that allow two followed links from any domain.
- Forum/comment signatures with optimized anchors.
- Link exchanges or partner pages created only for cross-linking.

## First 14 Days

1. Deploy the `/press/` page and verify sitemap, robots, canonical, and `/llms.txt` on production.
2. Submit the current sitemap in Google Search Console and request indexing for `/`, `/press/`, `/about/`, and the latest three comic pages.
3. Send five Tier 1 pitches from `docs/seo/backlink-outreach-tracker.md`: Modern Loss, Beyond the Dash, SOLRAD, The Comics Journal, and Graphic Medicine.
4. Send two news/review tips: Comics Beat and The Nib.
5. If the art is not generative AI, send Broken Frontier a review request with 2-3 interior pages. If it is generative AI, skip them.
6. Use `/obituary-stories/` as the primary link target for obituary-stories and obituary-articles searches; create one longer linkable essay if pitches still need a stronger asset: "What Are Obituary Comics?"
7. Track every outreach in a spreadsheet: target, contact URL/email, date sent, pitch angle, linked URL, reply, live URL, anchor text, follow/nofollow, notes.

## Pitch Templates

### Review or News Tip

Subject: New source-backed obituary comics archive

Hi [name],

I am building Memento Mori Obituary Comics, a daily archive of short visual biographies about people who faced death, illness, exile, violence, or loss and made work that survived them.

Each reader page includes the comic pages, crawlable summaries, source notes, image captions, JSON-LD, and a stable permalink. The current archive includes Aleksandr Solzhenitsyn, Primo Levi, Henri Matisse, Harriet Tubman, Stephen Hawking, Louis Zamperini, Frida Kahlo, Viktor Frankl, and Dostoyevsky.

Press/review resource page: https://www.finalnotes.page/press/
Archive: https://www.finalnotes.page/

Would this be a fit for a short news item, review consideration, or a writer interested in comics as visual biography?

Best,
[name]

### Guest Essay

Subject: Pitch: How an obituary becomes a visual biography

Hi [name],

I would like to pitch a concise essay for [publication]: "How an Obituary Becomes a Visual Biography."

The piece would use Memento Mori Obituary Comics as the working example, but it would focus on the broader question your readers care about: how life-story writing changes when images carry memory, text carries evidence, and the obituary becomes more than a checklist.

Possible link target if useful to readers: https://www.finalnotes.page/press/

Would this fit your editorial calendar?

Best,
[name]

### Resource Inclusion

Subject: Resource suggestion for visual biography / grief comics

Hi [name],

I found your resource list on [topic]. One relevant addition may be Memento Mori Obituary Comics, a source-backed visual biography archive with comic reader pages, summaries, source trails, and stable citation URLs.

Resource page: https://www.finalnotes.page/press/
Archive: https://www.finalnotes.page/

It may fit sections on graphic medicine, grief comics, visual biography, obituary writing, or mortality studies.

Best,
[name]
