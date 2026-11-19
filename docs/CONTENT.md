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
  `teamsPricing` and `teamsMonthly` ($199 per month including 5 developers,
  $29 per month for each additional developer). One Teams subscription
  includes both deployment options in `teamsDeployments`: Connected Desktops
  (no server, a peer network of the developers' Vekrun apps) and a Dedicated
  Coordinator (a customer-hosted Rust and PostgreSQL service). Never price them
  separately or call Teams "self-hosted" only. Teams is positioned as "Your
  engineering organization, working as one", far more than shared memory.
  Never write "per developer" (an e2e test bans it); say "for each additional
  developer". There is no checkout; purchase controls must not be added before
  one exists. There is no Cloud or Enterprise tier.
- `teamsInterestMailto`: the Teams interest email to the support inbox.
- `primaryNav`, `footerColumns`: Product, Teams, Pricing, Integrations; How It
  Works and Before & After live in the footer and in contextual links, with
  the utility pages.
- `productSections`: the Product page's five chapters (Think, Build, Prove,
  Deliver, Remember and collaborate), closed by Models. `productSubAnchors` lists the
  older section ids that now live inside a chapter; old URLs redirect to
  either list, and every id must stay on the page. There is no roadmap section.

`src/data/capabilities.ts` holds content shared between pages: project
examples and the eight Before & After comparisons.

## Claims

Describe what people can do, never how Vekrun does it internally. Never use
the word "Planned" or status badges in demos. Present capabilities as
experience and value, and present everything as done: never write "coming
soon", "coming later", "not available yet", "yet" or similar anywhere, including
for Teams, platforms, downloads and integrations. Calls to action are "Request
early access" and "Register Teams interest"; an e2e test bans the wording site-wide.
Living Architecture Intelligence is
available; show its sources and uncertainty rather than claiming it sees every
relationship. SSO and RBAC are included in Teams: never present them as an
add-on or an Enterprise upsell. Remote execution runs on the customer's own
servers; never imply Vekrun hosting, guaranteed security or certifications.
Example measurements (Competitive Engineering, experiments) carry a small
"Example" tag. Don't claim every task convenes a Council, every review is
independent, fully offline execution, or support for physical devices. See
`docs/content-audit-2026-11-12.md` for claims still awaiting confirmation.

## Homepage

The homepage is exactly five acts, and stays that way: the promise with the
app-window stage (`EngineHero`, Factory and CLI views, step navigation),
Competitive Engineering (`CompeteDemo`), one journey from context to reviewed
pull request (`JourneyDemo`), Engineering Memory with a short Teams bridge
(`MemoryBridge`), and Your rules with the two plans. Capability detail,
provider logos, Live Share and Before & After belong on their own pages. Every
demo renders its final state without JavaScript, respects reduced motion and
stops when the visitor takes control.

## Integrations

`src/data/integrations.ts` lists the groups shown on `/integrations/`, in three
bands: model providers (with a `tag` of Direct, Gateway or Local), optional
coding agents, and work and delivery tools. Work Anywhere hosts live in
`hostingProviders`, apart from the integrations, because they're where the
customer's servers run rather than services Vekrun connects to. Add a tool to
the right group with an `id`, `name` and a two-letter `mono` fallback; the page
search picks it up automatically.
Brand marks come from `simple-icons` in `src/components/brand/IntegrationLogo.astro`.
Never add availability badges to integrations. Grok reaches Vekrun three
ways, kept distinct everywhere: Grok Build (optional coding agent, `grok-build`),
Grok models directly through the xAI API (model provider, `xai`), and Grok
models through OpenRouter. Each signs in and bills differently. Name a current
model only as an example, and never imply a partnership or endorsement. xAI and Grok Build use the owner's official marks from the x.ai brand kit
(`src/assets/brand/spacexai-*`, `grok-logomark-*`). Its terms forbid any
alteration, so the files are inlined exactly as provided and the theme picks
the white or black version; never recolour or crop them.

Every brand tile shows an official logo; an e2e test fails on any monogram tile.
Codex uses the OpenAI Blossom from OpenAI's logo pack (openai.com/brand, no
separate Codex mark), white or black per theme. Slack (slack.com/media-kit) and
Antigravity CLI (antigravity.google/press) use their full-colour icons, served
unaltered as images because the files carry their own styles and ids.

## Product concepts and screenshots

Concept visuals in `src/components/` use demonstration data. They carry no
"illustrative concept" notice (the owner removed them); a small "Example" or
"Concept" tag on a mock that could pass for a working control is enough. Real screenshots go in
`public/shots/` as `{name}-1440.webp` and `{name}-960.webp` and are placed with
`<Screenshot name="…" alt="…" />`.

## Retired routes

Add a line to `redirects` in `astro.config.mjs` whenever a page moves. Targets
must be live pages, never another redirect; the unit tests enforce this.

## Wording

Call the people who use Vekrun "developers", never "engineers". "Engineering"
stays where it names the work (AI engineering team, Engineering Memory).
