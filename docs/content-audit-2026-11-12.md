# Content audit and capability restoration, 2026-11-12

What the site said before this pass, what was missing or overstated, and what
changed. The claim matrix at the end lists every capability claim, how it is
qualified on the site, and which ones still need the owner's confirmation.

## Findings

### 1. Missing entirely
- **Local model discovery and downloads** were only implied by Ollama and LM
  Studio logos. (Partly fixed in PR #9; now a full model-library example.)
- **Live Share for mobile and desktop apps.** The site described a web page and
  a comment, nothing about iOS, Android, Expo, Flutter or desktop previews.
- **Living Architecture Intelligence**, the planned architecture map.
- **Voice and Brainstorm.**
- **Environment setup** (toolchains, dependencies, services).
- **Building mobile and desktop apps**, as distinct from using Vekrun on a phone.
- **Interactive Browser** as its own capability, distinct from Live Share.
- **Concrete project examples** (Rails with PostgreSQL, Expo, Tauri, …).

### 2. Mentioned but under-explained
- **Council**: shown as a demo on How It Works, with no explanation of why more
  than one model matters.
- **Engineering Memory**: four bullets, nothing about answering questions with
  sources or reducing repeated explanation.
- **Git and delivery**: scattered across How It Works; no single statement of
  branch policies, approvals and parallel work.
- **Proof Packs**: no mention of acceptance criteria, review findings or the
  limits of test evidence.

### 3. Generic or misleading descriptions
- The Product page had seven headings and little substance.
- "Live Share puts the app on a secure link" did not explain that the link
  persists while the app is served from the developer's machine.
- How It Works said "The Coordinator brings in several models as a Council",
  implying every plan convenes one.

### 4. Differentiators that deserved more prominence
Local models without a paid API, multi-platform Live Share, the Council, and
the planned architecture map.

### 5. Consolidated
- Comparison copy now lives once in `src/data/capabilities.ts` and feeds both
  the homepage preview and the Before & After page.
- Project examples are shared between the homepage and Product.

### 6. Claims that could overstate
- "Coding agents" lines and "isolated VM" wording said more about internals
  than needed; now "isolated environment" on marketing pages. The Security page
  keeps its VM statement, because it explains the security model.
- Pricing said "Pricing TBD" for Cloud, contradicting the agreed $99 proposal.

### 7. Valuable material lost in the previous simplification
- `/before-and-after/` (removed in PR #8). Restored as a page with eight
  moments, an interactive day comparison and the audience lists that used to
  live on Benefits.
- The Benefits page's developer and engineering-lead lists, now on Before &
  After. `/benefits/` redirects there.

### 8. Navigation and conversion
- Before & After is back in the primary navigation.
- The homepage now links into Product from a capability tour, previews Before &
  After, and repeats the Cloud price where the plans are summarized.

## What changed

| Area | Change |
|---|---|
| Navigation | Product, How It Works, Before & After, Pricing; Get Vekrun |
| Homepage | Project examples under the stack marquees; "Your AI. Your hardware. Your choice."; stronger Memory and Live Share showcases with platform strip; "More than an AI coding agent" tour; Before & After preview; Cloud at $99 |
| Product | Rebuilt as a capabilities page: models, Council, Memory and Living Architecture Intelligence, Live Share (flow, platforms, limits), Interactive Browser, Proof Packs, delivery and Board, environments, voice, mobile and desktop apps, stack, Vekrun on your phone, tools |
| How It Works | Council described as used when a decision deserves it; link to Before & After |
| Before & After | Restored as a page |
| Pricing | Cloud $99 per developer per month ($1,188 per year), proposed; FAQ on price, compute and usage; wishlist asks about the price |
| Redirects | `/before-and-after/` is a page again; `/benefits/` → `/before-and-after/` |
| SEO | New descriptions; OG images for Product and Before & After; FAQ structured data matches the visible FAQ; only Free carries a schema.org Offer |

## Claim matrix

Status on the site: **Available** (stated plainly), **Qualified** (stated with
limits on the page), **Planned** (marked as planned), **Example** (a labelled
illustration).

| Claim | Where | Status on site | Needs confirmation |
|---|---|---|---|
| Native agent runs the workflow with OpenRouter or local models | Home, Product, Integrations, Pricing | Available | No |
| Discover and download local models through Ollama / LM Studio, with hardware fit | Home, Product | Available, with Example model library | Yes: confirm LM Studio downloads, and that hardware-fit guidance is shown |
| Vekrun ships no inference engine; local models don't make every workflow offline | Home, Product | Qualified | No |
| Claude Code, Codex, Antigravity optional | Everywhere | Available | No |
| Council with different models; cross-family review | Product | Qualified: not every task, no guarantee, certification in progress | Yes: update the note when mixed-model certification passes |
| Engineering Memory: structure, decisions, Work Items, evidence, Obsidian, sourced answers | Home, Product | Available | No |
| Living Architecture Intelligence | Home, Product | Planned, Concept graph | No |
| Live Share: web apps in the browser | Home, Product | Available | No |
| Live Share: iOS Simulator / Android emulator streaming, Expo, Flutter, Swift, Kotlin | Home, Product | Qualified: "Simulator preview", no physical devices | **Yes**: no evidence in this repository; confirm each target |
| Live Share: desktop apps | Home, Product | Qualified: "Selected targets", web-based shells only | **Yes** |
| Persistent review link, app served from the developer's machine | Product, Privacy | Qualified | No |
| Interactive Browser | Product | Available, real screenshot | No |
| Proof Packs: tests, criteria, revision, findings, gaps, approval | Home, Product, How It Works | Qualified: tests aren't a guarantee | No |
| Git policies, approvals, parallel work, Board | Product, How It Works | Available | No |
| Environment setup for Rails, Node.js, Python, Flutter, Expo; one-time prerequisites | Product | Qualified | **Yes**: confirm which toolchains are prepared automatically |
| Voice and Brainstorm, decisions into Work Items | Home, Product | Qualified: nothing becomes work without approval | **Yes**: confirm voice input ships, not only text brainstorm |
| Building iOS, Android, Expo, Flutter, Tauri, Electron apps | Product | Qualified: needs Xcode / Android SDK | **Yes** |
| Vekrun Mobile for iOS and Android (using Vekrun from a phone) | Product | Available (unchanged from earlier passes) | Yes, if not yet released |
| Cloud $99 per developer per month, proposed | Home, Pricing | Planned | No |
| Enterprise custom | Home, Pricing | Planned | No |

The owner has asked that brief claims be trusted as marketing direction
("this is a marketing website"); the rows marked **Yes** are listed so they can
be confirmed or adjusted, not because they were found to be wrong.

## Wishlist

The Cloud wishlist is a `mailto:` link to support@vekrunapp.com with a consent
line, an unsubscribe instruction and three optional questions (intended use,
the $99 price, the capability wanted most). There is no form, database or
analytics, by the owner's choice. To make it a real signup, connect a form
service or list provider and replace `cloudWishlistMailto`; until then, the
inbox is the list.
