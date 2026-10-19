# Vekrun website

The official website for [Vekrun](https://vekrunapp.com): a static Astro site
with Starlight documentation, deployed to GitHub Pages.

**Your terminal. Your models. Your rules.**

## Stack

- [Astro](https://astro.build) 7 with strict TypeScript, static output only
- [Tailwind CSS](https://tailwindcss.com) 4 through `@tailwindcss/vite`
- [Astro Starlight](https://starlight.astro.build) for `/docs/`
- Lucide icons, self-hosted Geist and Geist Mono
- Vitest for data invariants, Playwright for end-to-end tests
- GitHub Actions building to GitHub Pages

No framework runtime ships to the browser. Interactive pieces (theme toggle,
mobile menu, product preview, Factory stages, catalog filters) are small plain
scripts and every page works without JavaScript.

## Develop

Prerequisites: Node 22 or newer and pnpm 12.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output in dist/
pnpm preview      # serve dist/
```

## Verify

Run each separately and read the output.

```bash
pnpm check        # astro check: TypeScript and template errors
pnpm test         # vitest: content data invariants
pnpm build        # must succeed with zero errors
pnpm test:links   # every internal link and anchor in dist/ resolves
pnpm test:e2e     # playwright: navigation, theme, demo, docs, 404 (desktop + phone)
```

`pnpm verify` runs the first four in order. The first Playwright run needs
`pnpm exec playwright install chromium`.

Visual QA: `node scripts/screenshot.mjs http://localhost:4321 out/ / /factory/`
screenshots pages at desktop and phone widths in both themes.

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | Product metadata, navigation, footer, availability vocabulary. The single place product status strings live. |
| `src/content/data/*.json` | Integrations, roadmap entries, milestones, releases. Validated by `src/content.config.ts`. |
| `src/content/docs/docs/` | Documentation pages (Starlight). The extra `docs/` level mounts them at `/docs/`. |
| `src/pages/` | Marketing pages |
| `src/components/` | Shared components; `home/`, `features/`, `catalog/`, `docs/` are page-specific |
| `src/styles/global.css` | Design tokens (dark and light), base styles, utilities |
| `public/` | Static assets, `CNAME`, `robots.txt`, Open Graph image |
| `scripts/` | Link checker, screenshot helper, Open Graph image generator |
| `docs/` | Deployment, DNS and content-editing guides for this repository |

## Honesty rules for content

- A status of **Available** means implemented in the desktop project's main
  branch and exercised by tests on macOS. It does not mean a public build exists.
- Never mark an integration available without a verified implementation.
- Mockups are product concepts and say so until real recordings exist.
- The download page shows releases only from `releases.json`; keep it empty
  until signed artifacts exist.
- Reconcile `site.status.asOf` and the roadmap data whenever status changes.

See [docs/CONTENT.md](docs/CONTENT.md) for how to update each kind of content,
and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting, DNS and rollback.

## License

Apache License 2.0. See [LICENSE](LICENSE).
