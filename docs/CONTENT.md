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
- `plans`: Free, Cloud and Enterprise. Cloud's price comes from `cloudPrice`
  (a proposal, not on sale); the yearly figure is derived, never discounted.
  There is no checkout; purchase controls must not be added before one exists.
- `cloudWishlistMailto`, `enterpriseMailto`: email paths to the support inbox.
- `primaryNav`, `footerColumns`: Product, How It Works, Before & After, Pricing,
  and the footer.
- `productSections`: the Product page index; old URLs redirect to these ids.

`src/data/capabilities.ts` holds content shared between pages: project
examples, the homepage highlights and the eight Before & After comparisons.

## Claims

Describe what people can do, never how Vekrun does it internally. Mark planned
capabilities as planned where they appear (Living Architecture Intelligence,
Cloud, Enterprise). Don't claim every task convenes a Council, every review is
independent, fully offline execution, or support for physical devices. See
`docs/content-audit-2026-11-12.md` for claims still awaiting confirmation.

## Integrations

`src/data/integrations.ts` lists the groups shown on `/integrations/`. Add a
tool to the right group with an `id`, `name` and a two-letter `mono` fallback.
Brand marks come from `simple-icons` in `src/components/brand/IntegrationLogo.astro`.
Never add availability badges to integrations.

## Product concepts and screenshots

Concept visuals in `src/components/` use demonstration data. They carry no
"illustrative concept" notice (the owner removed them); a small "Example" or
"Concept" tag on a mock that could pass for a working control is enough. Real screenshots go in
`public/shots/` as `{name}-1440.webp` and `{name}-960.webp` and are placed with
`<Screenshot name="…" alt="…" />`.

## Retired routes

Add a line to `redirects` in `astro.config.mjs` whenever a page moves. Targets
must be live pages, never another redirect; the unit tests enforce this.
