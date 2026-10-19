# Editing content

Everything product-facing is data or Markdown. Components never hardcode a
status string.

## Product status, navigation, links

`src/data/site.ts`:

- `site.status` — the one-line status and the `asOf` reconciliation date
  shown across the site. Update the date whenever you reconcile.
- `site.repo.public` — flip to `true` when the desktop repository is public.
  GitHub links appear in the header, footer and hero only then.
- `site.contact.*` — `null` renders an honest "not published yet"; set a
  string to publish it.
- `primaryNav`, `footerColumns`, `featurePages` — navigation.
- `availability` — the three statuses and what they mean. Reused everywhere:
  `available` renders as "In development build", `in-development` as
  "In progress", `planned` as "Planned". The roadmap maps `implemented` to
  the first of these and adds `released` for public builds.
- `site.headline` / `site.subheading` — homepage copy; `site.tagline` is the brand line.

## Integrations

`src/content/data/integrations.json`. One object per integration; the schema
is in `src/content.config.ts`. Each entry has a category by purpose
(`ai-models`, `coding-tools`, `project-management`, `git-hosting`,
`developer-services`), one `enables` sentence in user language, connection
methods, a status and an optional note. Keep authentication details in the
docs, not in the catalog.

The unit tests refuse `available` for coding-agent accounts, MCP-only
connections, project-management and developer-service entries until those are
implemented, and reject engineering jargon in `enables`.

## Roadmap

`roadmap.json` is the public roadmap: user-facing entries grouped by `area`
(`terminal`, `ai-coding`, `board`, `ai-teams`, `code-review`, `releases`),
written as what you can do, with no milestone ids or engineering terms (the
unit tests check). Every entry has a status, an `updated` date not later than
`site.status.asOf`, and `verifiedOn` platforms; `implemented` requires at
least one. `released` is only valid once a release exists.

`milestones.json` holds the twelve engineering milestones. It is shown only on
the contributor progress page at `/docs/advanced/progress/`.

## Releases

`releases.json` is an empty array until signed artifacts exist. Each release
needs version, date, release-notes URL, GitHub release URL and artifacts with
platform, arch, format, download URL, size, SHA-256 and signing information.
The header call to action switches to "Download Vekrun" automatically when the
array is non-empty.

## Documentation

`src/content/docs/docs/<section>/<page>.md` (or `.mdx`). Sections are
task-oriented: getting-started, terminal, ai-coding, board, ai-teams, git,
settings, advanced. Frontmatter needs `title` and `description`;
`sidebar.order` controls position. User guides describe only implemented
workflows in plain language; a page for something not built opens with one
`:::note[Planned]` aside. Technical detail (architecture, internals, APIs,
contributing) lives under `advanced/`. Old URLs are redirected from
`astro.config.mjs`; add a redirect when you move a page.

## Mockups

Product mockups are HTML/CSS concepts and must render `ConceptNotice`.
Replace them with real screenshots or recordings only when the desktop app
produces them, and remove the notice at that point.

## Open Graph image

`node scripts/og-image.mjs` regenerates `public/og/default.png`.

## Product demonstrations and motion

Every mockup is built from the shared system, never from a screenshot:

- `src/components/mock/Window.astro` is the branded window chrome (dots,
  breadcrumb, optional tabs, a status slot). `Kanban.astro` is the reusable
  Board. `DemoControls.astro` adds Play/Pause and Replay plus the preview
  notice; put it inside the demo root so the runtime finds the buttons.
- `src/scripts/sequence.ts` runs a scripted demo: `createSequence(root,
  steps, { reset })`. It starts when the root is 35% visible, pauses when it
  leaves the viewport or the tab is hidden, exposes play/pause/replay, and
  jumps to the final state under `prefers-reduced-motion`. Write the final
  state into the HTML so the page reads correctly without JavaScript, and let
  `reset()` clear it when the script runs. Never loop a demo.
- Styles for elements a script creates at runtime must be global
  (`<style is:global>`), because Astro's scoped selectors only match markup
  from the template.
- Terminal text uses the global `.term` classes; diffs use `.diff-row`.
- Motion utilities live in `src/styles/global.css`: `.enter` / `.enter-scale`
  (page entrances, staggered with `--i`), `.reveal` and `.reveal-group`
  (scroll reveals, staggered children), `.card.card-hover`, `.link-slide`,
  `.icon-nudge`, `.ambient` lights and `.grid-field`. All of them are
  disabled under reduced motion.
- Real screenshots or recordings of the application replace a mockup as soon
  as they exist; remove the preview notice at that point.
