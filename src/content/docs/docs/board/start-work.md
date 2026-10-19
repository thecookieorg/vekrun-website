---
title: Start Work
description: One action takes a ticket to a worktree, an agent or a Factory run.
sidebar:
  order: 3
---

Verified on macOS only.

Select a ticket, press **Start Work**, choose a mode:

| Mode | What happens |
|---|---|
| Manual | A branch and worktree are created from the ticket, and a terminal opens there. No AI is involved. |
| AI Agent | The ticket is framed as data and handed to an agent session that opens in the worktree. The framed content is visible in the [egress preview](/docs/ai/context-management/) before anything is sent. |
| Factory | A plan is generated with the ticket reference attached, approved, and materialised into Factory tasks. See [Planning](/docs/factory/planning/). |

The ticket then shows a derived execution status on the Board, built from the worktree, plan, task and agent signals Vekrun has, separate from the provider's own status.

Manual work is a first-class path. The Board is usable without any model connected.
