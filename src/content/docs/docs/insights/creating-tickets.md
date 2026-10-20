---
title: Creating tickets from issues
description: Turn a monitoring issue into a ticket on Linear, Jira, Asana, GitHub or GitLab without creating duplicates.
sidebar:
  order: 7
---

**Create Ticket** sends an issue to any tracker connected to your Board.

## What happens

1. Vekrun checks whether a ticket already links to this issue. If one exists, it offers to open it instead of creating another.
2. It proposes a title and description built from the issue: message, environment, first and last seen, occurrence count and the provider link. You edit both before anything is sent.
3. The ticket is created on the tracker with your account's permissions and linked to the issue. The link survives retries and syncs, so one issue never spawns two tickets.

The new ticket appears on your [Board](/docs/board/viewing-tickets/) with its monitoring origin and the investigation stage shown on the card. From there, Start Work gives you a branch, a working copy and a terminal, with the ticket and the issue as context.

## What you choose

Which tracker and project the ticket goes to. Labels, priority and assignee are set on the tracker for now.

Ticket creation is tested against recorded responses for all five trackers; connecting a live tracker account is tracked on the [roadmap](/roadmap/).
