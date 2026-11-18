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
- `plans`: Free and Teams, nothing else. Teams pricing comes from
  `teamsPricing` and `teamsMonthly` ($199 per month for up to 10 engineers,
  $10 per month for each engineer beyond 10). There is no checkout; purchase
  controls must not be added before one exists. There is no Cloud or
  Enterprise tier.
- `teamsInterestMailto`: the Teams interest email to the support inbox.
- `primaryNav`, `footerColumns`: Product, How It Works, Teams, Pricing; the
  footer adds Before & After and the utility pages.
- `productSections`: the Product page index; old URLs redirect to these ids.

`src/data/capabilities.ts` holds content shared between pages: project
examples, the homepage highlights and the eight Before & After comparisons.

## Claims

Describe what people can do, never how Vekrun does it internally. Mark planned
capabilities as planned where they appear (Teams, Shared Engineering Memory,
SSO, Work Anywhere, What's next). Living Architecture Intelligence is
available; show its sources and uncertainty rather than claiming it sees every
relationship. SSO and RBAC are included in Teams: never present them as an
add-on or an Enterprise upsell. Remote execution runs on the customer's own
servers; never imply Vekrun hosting, guaranteed security or certifications.
Example measurements (Competitive Engineering, experiments) are labelled as
illustrative. Don't claim every task convenes a Council, every review is
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
