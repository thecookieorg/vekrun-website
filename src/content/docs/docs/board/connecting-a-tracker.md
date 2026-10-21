---
title: Connecting Jira, Linear or Asana
description: Where the Board gets your tickets.
sidebar:
  order: 1
---

:::note[Planned]
Connecting Linear, Jira, Asana, GitHub Issues or GitLab Issues is not built yet. The Board runs on a local ticket list in the development build. See the [roadmap](/roadmap/) and the [integrations catalog](/integrations/).
:::

## The idea

Your tracker stays the system of record. Vekrun connects to it, shows the tickets assigned to you, and turns any of them into a branch, a worktree, a terminal and, if you want, an agent. Finished work and status changes go back to the tracker with your approval.

## How connecting will work

- Sign in to the service from Settings. Several accounts from the same service can be connected at once, such as a personal and a work organization.
- Each ticket keeps its identity, its link, and its original status from the service.
- The service's workflow statuses map onto the Board's columns, and you can adjust the mapping.
- Only actions your account can actually perform are offered; anything else is shown disabled with the reason.
- When you are offline, cached tickets are marked as cached.
- Tickets can also be created from production issues in [Insights](/docs/insights/creating-tickets/), with a duplicate check first.

GitHub and GitLab issues have their own page: [GitHub and GitLab issues](/docs/board/github-and-gitlab-issues/).
