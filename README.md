# Memento Mori Obituary Comics

A Next.js archive for daily obituary comics about deceased people who faced death and made significant work afterward.

Live site: https://finalnotes.page/

Fallback Vercel URL: https://memento-mori-obituary-comics.vercel.app/

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
- `app/api/latest-pdf/route.js` for the paid agent PDF endpoint.
- `app/robots.js`, `app/sitemap.js`, and `app/llms.txt/route.js` for discovery files.
- `app/globals.css` for design tokens and component styling.

## Add a generated comic

Comic metadata lives in `comics.json`. New generated images and PDFs are staged under `public/comics/<slug>/`, then uploaded to private Vercel Blob storage. The rendered site serves media from `/media/comics/<slug>/...`; it does not link directly to `/public`.

```bash
python scripts/add_comic.py /path/to/generated-output \
  --slug dostoyevsky-borrowed-time \
  --person "Fyodor Mikhailovich Dostoyevsky" \
  --title "Borrowed Time" \
  --years "1821-1881" \
  --dek "Russian novelist. Survivor of a staged execution." \
  --event "1849 staged execution / mock firing squad" \
  --sources "Britannica; The Marginalian; Public Domain Review; Literary Hub"
```

Refresh and validate existing public media without generating static HTML:

```bash
python scripts/add_comic.py --render-only
```

Upload staged media into the private Blob store:

```bash
pnpm run blob:dry-run -- --slug <slug> --require-assets
pnpm run blob:upload -- --slug <slug> --require-assets
```

`blob:upload` requires `BLOB_READ_WRITE_TOKEN` in `.env.local` or the deployment environment. Blob objects are written with stable keys such as `comics/<slug>/pages/01-<slug>.jpg`, `access: "private"`, and no random suffix.

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
