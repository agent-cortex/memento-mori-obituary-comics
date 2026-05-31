#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: scripts/deploy_latest.sh /comics/<slug>/ [commit-message]" >&2
  exit 2
fi

comic_path="$1"
commit_message="${2:-publish comic ${comic_path}}"

if ! git diff --quiet || [ -n "$(git status --porcelain)" ]; then
  git add index.html comics.json comics assets scripts README.md vercel.json .github .gitignore \
    about llms.txt sitemap.xml robots.txt api tests docs package.json package-lock.json
  git commit -m "$commit_message"
  git push origin main
fi

# Production deploy from the committed tree. Use the stable production alias for user-facing links.
pnpm dlx vercel deploy --prod --yes | tee /tmp/memento-mori-vercel-deploy.log
site_url="https://memento-mori-obituary-comics.vercel.app"
printf '%s%s\n' "${site_url%/}" "$comic_path"
