# Memento Mori Obituary Comics

A static archive for daily obituary comics about deceased people who faced death and made significant work afterward.

Live site: https://finalnotes.page/

Fallback Vercel URL: https://memento-mori-obituary-comics.vercel.app/

Each comic gets a durable permalink:

```text
/comics/<slug>/
```

## Add a generated comic

The repo is now a staging + metadata workflow. `scripts/add_comic.py` still creates `comics/<slug>/comic.json`, `index.html`, and local JPG/PDF assets, but new binary comic assets are ignored by git and must be uploaded to private Vercel Blob before deploy.

```bash
python scripts/add_comic.py /path/to/generated-output \
  --slug new-comic-slug \
  --person "Name" \
  --title "Title" \
  --years "1900–2000" \
  --dek "Short description" \
  --event "Mortality event" \
  --sources "Source A; Source B"

# Upload only this comic's local binaries into private Blob.
pnpm run blob:dry-run -- --slug new-comic-slug --require-assets
pnpm run blob:upload -- --slug new-comic-slug --require-assets

# Regenerate static metadata/pages and verify.
python scripts/add_comic.py --render-only
pnpm test

# Commit, push, and deploy.
./scripts/deploy_latest.sh /comics/new-comic-slug/ "publish: New Comic"
```

On this machine, older ignored binaries may still exist locally. If you omit `--slug`, `blob:dry-run` scans every local JPG/PNG/PDF under `comics/`; on a fresh clone that usually means only newly generated local assets.

The site is intentionally boring infrastructure: static HTML and Vercel Functions. Comic binaries live in private Vercel Blob storage and are served through stable `/media/comics/...` site URLs with CDN cache headers. No database. No auth for the public reader.

## Substack newsletter

The public newsletter surface is `Borrowed Time Dispatch` at:

```text
/newsletter/
```

The connected Substack publication is:

```text
https://finalnotes.substack.com
```

Render and verify the connected newsletter artifacts with:

```bash
python scripts/add_comic.py --render-only
python scripts/verify_substack_launch.py --url https://finalnotes.substack.com
pnpm test
```

The generator also accepts `SUBSTACK_URL=...` as an override for staging or future publication changes. When the URL is configured, `/newsletter/` embeds the Substack signup iframe and the newsletter buttons open the publication URL. Substack's native embed code can be found in the publication settings under Growth features.

Launch copy and first-issue materials live in:

```text
docs/newsletter/substack-publication-profile.md
docs/newsletter/substack-launch-checklist.md
docs/newsletter/issue-001-borrowed-time-dispatch.md
```

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

To avoid re-listing old ignored binaries on a working tree that has historical local assets, scope the upload to the new comic:

```bash
pnpm run blob:dry-run -- --slug <slug> --require-assets
pnpm run blob:upload -- --slug <slug> --require-assets
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
