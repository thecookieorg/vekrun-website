---
title: Ticket sources
description: Where the Board gets its tickets today, and which providers are coming.
sidebar:
  order: 1
---

:::note[Planned]
Live ticket providers (Linear, Jira, Asana, GitHub Issues, GitLab Issues) are milestone 10. Today the Board runs on a **Local** ticket source intended for development and testing. See the [roadmap](/roadmap/) and the [integrations catalog](/integrations/).
:::

## What the Board is

A unified view of the tickets assigned to you across connected services, with Start Work on every card. It does not replace Linear, Jira or Asana; those remain the system of record. Vekrun is the execution layer between a ticket and the terminal, the worktree, the agent and the pull request.

## What exists today

Verified on macOS only: the Board view with four logical columns (To Do, In Progress, In Review, Done), ticket detail, the repository registry, and Start Work in three modes. Tickets come from the Local source.

## How providers will connect

- Each ticket keeps its source identity and its original provider status.
- Provider statuses map to Board columns through a configurable mapping; the original status is always preserved.
- Several accounts from the same provider can be connected at once.
- Only actions the connected provider and your authenticated account actually support are offered. Unsupported actions are disabled with the reason shown.
- Ticket content is untrusted input to agents, like any other external text.
- Cached data is distinguished from live provider state when you are offline.
