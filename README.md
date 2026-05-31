# Memento Mori Obituary Comics

A static archive for daily obituary comics about deceased people who faced death and made significant work afterward.

Live site: https://obit.agentcortex.space/

Fallback Vercel URL: https://memento-mori-obituary-comics.vercel.app/

Each comic gets a durable permalink:

```text
/comics/<slug>/
```

## Add a generated comic

```bash
python scripts/add_comic.py /path/to/generated-output \
  --slug dostoyevsky-borrowed-time \
  --person "Fyodor Mikhailovich Dostoyevsky" \
  --title "Borrowed Time" \
  --years "1821–1881" \
  --dek "Russian novelist. Survivor of a staged execution." \
  --event "1849 staged execution / mock firing squad" \
  --sources "Britannica; The Marginalian; Public Domain Review; Literary Hub"

./scripts/deploy_latest.sh /comics/dostoyevsky-borrowed-time/ "publish: Dostoyevsky comic"
```

The site is intentionally boring infrastructure: static HTML and Vercel Functions. Comic binaries live in private Vercel Blob storage and are served through stable `/media/comics/...` site URLs with CDN cache headers. No database. No auth for the public reader.

## Vercel Blob comic assets

Production deployments must set:

```text
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Upload the local comic JPG/PNG/PDF files into private Blob storage before deploying HTML that references them:

```bash
pnpm run blob:dry-run
pnpm run blob:upload
python scripts/add_comic.py --render-only
pnpm test
```

Blob pathnames mirror the old repo layout, for example:

```text
comics/<slug>/pages/01-<slug>.jpg
comics/<slug>/<slug>.pdf
```

The browser loads those assets from:

```text
/media/comics/<slug>/pages/01-<slug>.jpg
```

The `/media/*` rewrite sends requests to `api/blob-media.js`, which reads the private Blob object and returns a cacheable response. New binary comic assets are ignored by git; keep `comic.json`, `index.html`, and archive metadata in the repo.

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
