# Editing content

## Voice

Short headlines, one supporting sentence, plain English. One idea per section.
Show the product instead of describing it. Avoid "revolutionize", "seamlessly",
"harness the power of AI" and similar.

## Facts

`src/data/site.ts` holds everything that must stay consistent across pages:

- `site.headline`, `site.subheading`, `site.description`
- `site.release`: flip `downloadAvailable` only when a signed installer is
  published, then add the release to the Download page.
- `site.contact`: set the general and security addresses when they exist; the
  Contact and Security pages render them automatically.
- `pricing`: do not change the formula. `purchasable` stays `false` until a real
  checkout exists; purchase controls must not be added before then.
- `personal`, `teams`: what each package includes.
- `primaryNav`, `footerColumns`: the five primary destinations and the footer.

## Integrations

`src/data/integrations.ts` lists the groups shown on `/integrations/`. Add a
tool to the right group with an `id`, `name` and a two-letter `mono` fallback.
Brand marks come from `simple-icons` in `src/components/brand/IntegrationLogo.astro`.
Never add availability badges.

## Product concepts and screenshots

Concept visuals in `src/components/factory/`, `org/` and `visuals/` use
demonstration data and must keep their concept notice. Real screenshots go in
`public/shots/` as `{name}-1440.webp` and `{name}-960.webp` and are placed with
`<Screenshot name="…" alt="…" />`.

## Retired routes

Add a line to `redirects` in `astro.config.mjs` whenever a page moves. Targets
must be live pages, never another redirect; the unit tests enforce this.
