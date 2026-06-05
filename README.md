# Memento Mori Obituary Comics

A Next.js archive for daily obituary comics about deceased people who faced death and made significant work afterward.

Production site: https://www.finalnotes.page/

Fallback Vercel URL: https://memento-mori-obituary-comics.vercel.app/

Repository: https://github.com/megabyte0x/memento-mori-obituary-comics

## Public resource links

These are the main public citation targets for readers, librarians, journalists, and teachers:

- [Obituary stories and articles](https://www.finalnotes.page/obituary-stories/)
- [Obituary articles as reported life stories](https://www.finalnotes.page/obituary-articles/)
- [How to write an obituary story](https://www.finalnotes.page/how-to-write-an-obituary-story/)
- [Obituary research guide](https://www.finalnotes.page/obituary-research-guide/)
- [Press and source-request resources](https://www.finalnotes.page/press/)

## Maintainer surface

This project is maintained as a small open-source publishing system. The repo includes:

- a Next.js App Router archive and comic reader
- Vercel Blob-backed private media storage with stable public `/media/...` URLs
- Next image optimization for Blob-backed comic JPG/PNG covers and pages
- an x402-paid `GET /api/latest-pdf` endpoint for agent-accessible PDF delivery
- regression tests for Blob delivery, x402/latest-PDF behavior, upload tooling, and comic data

Each comic gets a durable permalink:

```text
/comics/<slug>/
```

## Development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm test
pnpm build
```

The app uses the Next.js App Router. Route and UI ownership is:

- `app/page.jsx` for the archive homepage.
- `app/comics/[slug]/page.jsx` and `components/reader-shell.jsx` for the reader.
- `app/media/[...path]/route.js` for private Vercel Blob media delivery through stable `/media/comics/...` URLs.
- `app/about/page.jsx` for editorial method.
- `app/press/page.jsx` for editors, reviewers, backlink outreach, and citation resources.
- `app/api/latest-pdf/route.js` for the paid agent PDF endpoint.
- `app/robots.js`, `app/sitemap.js`, and `app/llms.txt/route.js` for discovery files.
- `app/globals.css` for design tokens and component styling.

## Add a generated comic

Comic metadata lives in `comics.json`, with per-comic source metadata under `comics/<slug>/comic.json`. New generated images and PDFs are staged under `comics/<slug>/`, ignored by git, then uploaded to private Vercel Blob storage. The rendered site serves media from `/media/comics/<slug>/...`; it does not link directly to local binaries.

```bash
python scripts/add_comic.py /path/to/generated-output \
  --slug new-comic-slug \
  --person "Name" \
  --title "Title" \
  --years "1900-2000" \
  --dek "Short description" \
  --event "Mortality event" \
  --sources "Source A; Source B"
```

Validate metadata without generating static HTML:

```bash
python scripts/add_comic.py --render-only
```

Upload staged media into the private Blob store:

```bash
pnpm run blob:dry-run -- --slug <slug> --require-assets
pnpm run blob:upload -- --slug <slug> --require-assets
```

`blob:upload` requires `BLOB_READ_WRITE_TOKEN` in `.env.local` or the deployment environment. Blob objects are written with stable keys such as `comics/<slug>/pages/01-<slug>.jpg`, `access: "private"`, and no random suffix.

On this machine, older ignored binaries may still exist locally. If you omit `--slug`, `blob:dry-run` scans every local JPG/PNG/PDF under `comics/`; on a fresh clone that usually means only newly generated local assets.

## Substack newsletter

The public newsletter surface is `Borrowed Time Dispatch` at:

```text
/newsletter/
```

The connected Substack publication is:

```text
https://finalnotes.substack.com
```

Launch copy and first-issue materials live in:

```text
docs/newsletter/substack-publication-profile.md
docs/newsletter/substack-launch-checklist.md
docs/newsletter/issue-001-borrowed-time-dispatch.md
```

For Vercel CLI compatibility, use the checked-in deploy script or run ad-hoc Vercel commands through `pnpm dlx vercel@latest ...` rather than relying on an old global `vercel` binary.

## Paid agent PDF endpoint

Agents can request the latest comic PDF at:

```text
GET /api/latest-pdf
```

The endpoint uses x402 and requires an exact 0.1 USDC payment on Base mainnet (`eip155:8453`) before returning the PDF bytes.

Production deployments must set:

```text
X402_PAY_TO=0xYourReceivingWallet
CDP_API_KEY_ID=your-cdp-key-id
CDP_API_KEY_SECRET=your-cdp-key-secret
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```
