# Vekrun website

The marketing site for [Vekrun](https://vekrunapp.com): a static Astro site
deployed to GitHub Pages.

**From prompt to verified outcome.** Vekrun is a local-first AI software
engineering Factory.

## Stack

- [Astro](https://astro.build) 7 with strict TypeScript, static output only
- [Tailwind CSS](https://tailwindcss.com) 4 through `@tailwindcss/vite`
- Inter Variable and Geist Mono, self-hosted through Fontsource
- No client framework. The few interactive pieces (phone menu, theme toggle,
  the scripted product demonstrations, the Teams calculator) are small inline
  scripts.

## Develop

Prerequisites: Node 22 or newer and pnpm 12.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output in dist/
pnpm preview      # serve dist/
```

## Verify

```bash
pnpm check        # astro check: TypeScript and template errors
pnpm test         # vitest: pricing, navigation, redirects, integrations
pnpm build        # must succeed with zero errors
pnpm test:links   # every internal link and anchor in dist/ resolves
pnpm test:e2e     # playwright + axe: pages, nav, pricing, demos, a11y, SEO (desktop + phone)
```

`pnpm verify` runs the first four in order. The first Playwright run needs
`pnpm exec playwright install chromium`.

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | Positioning, navigation, packages, pricing and release facts. One source of truth. |
| `src/data/integrations.ts` | Integration groups and the platforms strip. |
| `src/pages/` | One file per page. Retired routes are redirects in `astro.config.mjs`. |
| `src/components/` | `factory/` and `org/` are product concepts, `visuals/` holds Council and screenshots, `teams/` the plan cards and calculator, `mock/` the window chrome. |
| `src/styles/global.css` | Design tokens (taken from the desktop app) and shared primitives. |
| `public/shots/` | Real screenshots of the Vekrun desktop app. |
| `scripts/brand-mark.mjs`, `scripts/og-image.mjs` | Regenerate the logo assets and Open Graph images. |
| `docs/` | Deployment, DNS and content-editing guides for this repository. |

## Rules

- Pricing comes only from `site.ts`: $199 a month for up to 10 engineers, then
  $10 a month per additional engineer. Planned launch pricing; no checkout.
- No status labels, no "coming soon", no fabricated testimonials, screenshots,
  downloads or certifications. Download availability lives in `site.release`.
- Concept visuals carry an "Illustrative product concept" notice.
- No left-border accent stripes. Use full outlines or a tint.

The public documentation and roadmap were retired on 2026-11-01; their sources
are kept under the git tag `archive/docs-and-roadmap-2026-11-01`.

See [docs/CONTENT.md](docs/CONTENT.md) for editing content and
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting, DNS and rollback.
