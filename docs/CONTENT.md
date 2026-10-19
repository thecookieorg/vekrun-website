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
- `availability` — the four statuses and what they mean. Reused everywhere.

## Integrations

`src/content/data/integrations.json`. One object per integration; the schema
is in `src/content.config.ts`. Statuses:

- `available` — verified implementation in the desktop project (tests pass).
- `in-development` — partly on `main`.
- `planned` — scheduled, with a milestone.
- `requires-configuration` — works with your own credentials or endpoint.

The unit tests refuse `available` for coding-agent accounts and MCP servers
until those are implemented; adjust the test when they are.

## Roadmap

`milestones.json` (the twelve milestones) and `roadmap.json` (feature-level
entries). Every entry has a status, a milestone, an `updated` date not later
than `site.status.asOf`, and `verifiedOn` platforms. `implemented` requires at
least one verified platform. `released` is only valid once a release exists.

## Releases

`releases.json` is an empty array until signed artifacts exist. Each release
needs version, date, release-notes URL, GitHub release URL and artifacts with
platform, arch, format, download URL, size, SHA-256 and signing information.
The header call to action switches to "Download Vekrun" automatically when the
array is non-empty.

## Documentation

`src/content/docs/docs/<section>/<page>.md` (or `.mdx`). Frontmatter needs
`title` and `description`; `sidebar.order` controls position. Pages for
features that are not built open with a `:::caution[Not built yet]` or
`:::note[Planned]` aside naming the milestone. Do not write setup steps for
anything that does not run.

## Mockups

Product mockups are HTML/CSS concepts and must render `ConceptNotice`.
Replace them with real screenshots or recordings only when the desktop app
produces them, and remove the notice at that point.

## Open Graph image

`node scripts/og-image.mjs` regenerates `public/og/default.png`.
