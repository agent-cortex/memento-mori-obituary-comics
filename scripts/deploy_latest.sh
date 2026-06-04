#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: scripts/deploy_latest.sh /comics/<slug>/ [commit-message]" >&2
  exit 2
fi

comic_path="$1"
commit_message="${2:-publish comic ${comic_path}}"
slug="${comic_path#/comics/}"
slug="${slug%/}"
site_url="${FINALNOTES_SITE_URL:-https://www.finalnotes.page}"
site_url="${site_url%/}"

if [ -z "$slug" ] || [ "$slug" = "$comic_path" ] || [[ "$slug" == *"/"* ]]; then
  echo "comic path must look like /comics/<slug>/" >&2
  exit 2
fi

if [ ! -d "comics/$slug" ]; then
  echo "comic directory not found: comics/$slug" >&2
  exit 2
fi

# New comic binaries are intentionally gitignored. Upload them through the live
# finalnotes.page app so the write happens inside Megabyte's Vercel project and
# lands in the Blob store that actually backs production media.
pnpm run blob:dry-run -- --slug "$slug" --require-assets
pnpm run blob:upload-live -- --slug "$slug" --require-assets --base-url "$site_url"
pnpm run blob:verify-live -- --slug "$slug" --base-url "$site_url"

python scripts/add_comic.py --render-only
pnpm test
pnpm build

if ! git diff --quiet || [ -n "$(git status --porcelain)" ]; then
  git add app components lib scripts README.md vercel.json next.config.mjs .github .gitignore .vercelignore \
    tests docs package.json pnpm-lock.yaml pnpm-workspace.yaml comics.json comics
  git commit -m "$commit_message"
  git push origin main
fi

# finalnotes.page is served by Megabyte's Vercel project through the GitHub
# integration. Do not deploy from the local Vercel CLI by default: this machine's
# CLI may be linked to an old agent-owned project/scope. If manual CLI deploy is
# deliberately needed, opt in with FINALNOTES_USE_VERCEL_CLI_DEPLOY=1.
if [ "${FINALNOTES_USE_VERCEL_CLI_DEPLOY:-0}" = "1" ]; then
  pnpm dlx vercel@latest deploy --prod --yes | tee /tmp/memento-mori-vercel-deploy.log
else
  echo "Skipping local Vercel CLI deploy; waiting for GitHub-linked production deploy on $site_url"
fi

page_url="${site_url}${comic_path}"
for attempt in $(seq 1 60); do
  status="$(curl -L -s -o /tmp/finalnotes-latest-page.html -w '%{http_code} %{content_type}' "$page_url" || true)"
  case "$status" in
    200\ text/html*)
      printf '%s\n' "$page_url"
      exit 0
      ;;
  esac
  echo "waiting for $page_url ($attempt/60): $status" >&2
  sleep 10
done

echo "production page did not become ready: $page_url" >&2
exit 1
