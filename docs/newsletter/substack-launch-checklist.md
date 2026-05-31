# Borrowed Time Dispatch Substack Launch Checklist

Use this when creating the Substack publication and connecting it to the static site.

## Publication Setup

- Create a Substack publication named `Borrowed Time Dispatch`.
- Use the connected publication URL: `https://finalnotes.substack.com`.
- Start from `docs/newsletter/substack-publication-profile.md` for the publication profile, About page, welcome email, and paid-tier draft.
- Point the public site back to `https://obit.agentcortex.space/newsletter/`.
- Add the live site, archive, and editorial method links to the Substack About page.
- Keep the first issue free so the public archive, the Substack list, and the site signup can all build trust before a paid ask.

## Connect The Site

After Substack gives you the publication URL, regenerate the static site with:

```bash
python scripts/add_comic.py --render-only
python scripts/verify_substack_launch.py --url https://finalnotes.substack.com
pnpm test
git diff --check
```

Then deploy and verify:

- `/newsletter/` renders the Substack embed instead of the placeholder.
- The homepage `Borrowed Time Dispatch` button opens the Substack publication.
- A comic reader page shows the newsletter CTA after the PDF section.
- `sitemap.xml` includes `https://obit.agentcortex.space/newsletter/`.

## First Issue

- Start from `docs/newsletter/issue-001-borrowed-time-dispatch.md`.
- Send a test email to yourself before publishing.
- Click every comic link from the test email.
- Confirm the public web version looks good on mobile.
- Publish the first issue as a free post.

## Traditional Monetization

- Start with free issues until readers understand the rhythm and subject.
- Add a paid tier once there is a repeatable cadence: monthly support, yearly support, and an optional founding subscriber tier.
- Offer paid subscribers early access to new comics, source notes, PDF collections, or behind-the-scenes drafts.
- Keep sponsorships small and aligned: books, art tools, research tools, memorial products, estate-planning education, or history projects.
- Use the site archive as the permanent public proof of quality, then use the newsletter as the relationship and conversion layer.

## Crypto Monetization

- Keep crypto support on the site rather than making the first email feel like a wallet prompt.
- Use the existing ZEC support modal for reader donations.
- Keep `GET /api/latest-pdf` as the machine-payable 0.1 USDC x402 endpoint for agents that want the latest PDF.
- Add crypto calls to action only after the regular reader path is clear: read comic, subscribe, optionally support.
- Avoid token-gated complexity until the simple Substack paid tier and x402 PDF endpoint have usage data.

## Launch Metrics

- Free subscriber count.
- Open rate and click rate to comic pages.
- Replies from readers with suggested subjects.
- Conversion from `/newsletter/` to Substack signup.
- Paid conversion after the first paid ask.
