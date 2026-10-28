---
title: Vekrun documentation
description: "How to use Vekrun, the AI software engineering Factory: install it, connect your coding CLIs and repositories, assign outcomes and review verified work."
---

Vekrun is an AI software engineering Factory. You give it an outcome, a feature, a ticket or a production incident, and it coordinates your coding agents to plan, build, test, verify and deliver the change in your own repositories. You stay in control of what merges.

Vekrun is in development. There is no public release yet. These pages describe what the development build does on macOS, and mark everything else as planned.

## Start here

1. [Install Vekrun](/docs/getting-started/installation/)
2. [Connect your coding CLIs and tools](/docs/getting-started/connecting-tools/)
3. [Import a repository](/docs/getting-started/importing-a-repository/) by URL, from your machine, or with Fork & Clone
4. [Validate its environment](/docs/getting-started/validating-the-environment/)
5. [Assign your first outcome](/docs/getting-started/first-outcome/)
6. [Inspect the evidence](/docs/getting-started/inspecting-evidence/)
7. [Connect your phone or your team](/docs/getting-started/mobile-and-teams/), when applicable

## How these docs mark status

- Pages without a note describe things that work in the development build today.
- A **Planned** note marks a capability that is not built yet. It explains the intent and links to the [roadmap](/roadmap/); it never gives steps you cannot follow.

If a page and the application disagree, the application is right and the page needs a fix.

## Sections

- [AI Factory](/docs/factory/overview/): how a job runs, planning, Council, running and reviewing agent tasks.
- [Board and trackers](/docs/board/connecting-a-tracker/): connect a tracker, see your work, start a job, status sync.
- [Production incidents](/docs/insights/overview/): connect monitoring, investigate, create tickets and plans, delegate fixes, verify in production.
- [Git, pull requests and reviews](/docs/git/branches/): branches, worktrees, the review inbox, pull requests, AI reviews.
- [CI, delivery and security](/docs/pipelines/overview/): CI runs, deployment verification, security findings.
- [Settings and privacy](/docs/settings/providers/): providers, credentials, data storage, permissions.
- Advanced tools for taking over a job: [coding sessions](/docs/ai-coding/choosing-models/) and [terminal and SSH](/docs/terminal/shell-configuration/).
- [Technical reference](/docs/advanced/architecture/): architecture, agent runtime, MCP, remote workers, APIs and the engineering history.
