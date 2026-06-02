# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-03
- Primary product surfaces: Next.js archive homepage, themed Substack subscription section, newsletter route, comic reader pages, editorial method page, support dialog, paid latest-PDF endpoint.
- Evidence reviewed: README.md, app source, app/globals.css, components, comics.json, tests, generated Image Gen concept at /Users/megabyte0x/.codex/generated_images/019e8a53-2da8-7de0-b7ac-26329bb3ad54/ig_04bd767c2cb1be97016a1f5176a1d081919a57e46cb303e851.png.

## Brand
- Personality: quiet, archival, literary, mortality-aware, exacting.
- Trust signals: crawlable source notes, structured data, clear PDF/download affordances, restrained navigation, real comic page imagery.
- Avoid: motivational slop, doomscroll density, faux SaaS dashboards, fake metrics, ornate clutter, unserious gamification, generic card bento layouts.

## Product goals
- Goals: make the latest obituary comic immediately readable, keep the archive scannable, preserve image/PDF access, and support source-literate reading by humans and agents.
- Non-goals: social feed behavior, personalization-heavy onboarding, live database/admin workflows, marketing-site theatrics.
- Success signals: a first-time visitor can identify the latest comic and open it within one glance; returning readers can browse archive cards quickly; reader controls work without blocking the images.

## Information architecture
- Primary navigation: Memento Mori brand link, Archive, Method, Newsletter, Support.
- Core routes/screens: `/` archive, `/newsletter/` Substack signup, `/comics/<slug>/` reader, `/about/` editorial method, `/api/latest-pdf` paid agent PDF endpoint.
- Content hierarchy: latest issue first, archive preview second, ritual/reflection tools secondary, editorial/source material in reader footer and About.

## Visual language
- Color: obsidian black background, aged paper text, muted antique gold accents, thin low-opacity dividers, restrained red only for semantic emphasis.
- Typography: classical display face for brand/headlines, Cormorant Garamond for editorial body, Plus Jakarta Sans for UI labels and controls.
- Spacing/layout rhythm: wide desktop gutters, strong vertical dividers, compact archive cards, first viewport with archive preview visible.
- Shape/radius/elevation: mostly 8px radii for cards and controls, hairline borders, minimal glow, no nested cards.
- Motion: subtle hover lift and reader transitions; respect reduced motion.
- Imagery/iconography: real comic page covers and contact-sheet/PDF imagery; small symbols only when they clarify controls.

## Components
- React components: `SiteNav`, `LatestPanel`, `ArchiveCard`, `SubstackSubscribe`, `RitualTools`, `ReaderShell`, `SupportDialog`.
- UI primitives: shadcn-style local wrappers in `components/ui` over Radix Dialog, Radix ToggleGroup, Radix Slot, and class-variance-authority.
- Token/component ownership: `app/globals.css` owns tokens and visual classes; `components/*` owns behavior; `lib/comics.js` owns archive data helpers.

## Accessibility
- Target standard: practical WCAG 2.1 AA for contrast, keyboard navigation, labels, and modal semantics.
- Keyboard/focus behavior: reader controls and support dialog must be keyboard reachable; dialog close responds to Escape through Radix.
- Contrast/readability: paper/gold text must remain legible on dark surfaces; long ZEC address wraps safely.
- Screen-reader semantics: reader pages keep sr-only headings and image captions; dialogs retain titles and `aria-modal`.
- Reduced motion and sensory considerations: hover motion and reader transitions should be minimized for `prefers-reduced-motion`.

## Responsive behavior
- Supported breakpoints/devices: desktop, tablet, and narrow mobile down to 360px.
- Layout adaptations: desktop split hero, compact card grid, mobile stacked hero/latest issue/cards, reader toolbar collapses into More menu.
- Touch/hover differences: controls must not depend on hover; card hover polish is optional enhancement.

## Implementation constraints
- Framework/styling system: Next.js App Router, React, local shadcn-style primitives, plain CSS in `app/globals.css`.
- Data and assets: `comics.json` is metadata source of truth; served comic media lives in `public/comics/<slug>/`.
- Publishing: `scripts/add_comic.py` updates Next inputs only and does not generate static HTML.
- Performance constraints: preserve intrinsic image dimensions, eager-load only first/hero images, lazy-load the rest, and keep third-party scripts nonessential.
- Compatibility constraints: Vercel deployment plus Next route handler for x402; `next.config.mjs` traces `comics.json` and public comic PDFs for the paid endpoint.
- Test/screenshot expectations: run `pnpm test`; run `pnpm build`; verify homepage, reader controls, support dialog, desktop and mobile layouts in Browser.
