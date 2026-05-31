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

if [ -z "$slug" ] || [ "$slug" = "$comic_path" ] || [[ "$slug" == *"/"* ]]; then
  echo "comic path must look like /comics/<slug>/" >&2
  exit 2
fi

if [ ! -d "comics/$slug" ]; then
  echo "comic directory not found: comics/$slug" >&2
  exit 2
fi

# New comic binaries are intentionally gitignored. Upload them before committing
# HTML that references /media/comics/<slug>/... through the private Blob route.
pnpm run blob:dry-run -- --slug "$slug" --require-assets
pnpm run blob:upload -- --slug "$slug" --require-assets
python scripts/add_comic.py --render-only
pnpm test

if ! git diff --quiet || [ -n "$(git status --porcelain)" ]; then
  git add index.html comics.json comics assets scripts README.md vercel.json .github .gitignore \
    about llms.txt sitemap.xml robots.txt api tests docs package.json
  [ -f pnpm-lock.yaml ] && git add pnpm-lock.yaml
  git commit -m "$commit_message"
  git push origin main
fi

# Production deploy from the committed tree. Use the stable production alias for user-facing links.
pnpm dlx vercel@latest deploy --prod --yes | tee /tmp/memento-mori-vercel-deploy.log
site_url="https://finalnotes.page"
printf '%s%s\n' "${site_url%/}" "$comic_path"
