---
title: Review inbox
description: The pull requests and merge requests waiting for you, reviewed and answered from Vekrun.
sidebar:
  order: 3
---

:::note[Planned]
The Review Inbox is approved, high-priority scope that is not built yet. See the [roadmap](/roadmap/).
:::

## The idea

One list of the pull requests and merge requests that need you, filtered by what matters:

- Requested from you, assigned to you, or opened by you.
- Your team's pull requests across the repositories you choose.
- CI status, draft status and recently updated.

GitLab merge requests get the same treatment where its API allows it.

## Reviewing

Open a pull request to read the diff, the discussion and the checks. Ask for an AI review, which runs the same review engine that works on local branches today, and compare findings from several models when a change is contested. Then act: approve, request changes, comment, or add inline comments on specific lines.

## What stays true

- GitHub and GitLab remain the source of truth for every submitted review.
- An AI review is never a human approval. You decide what gets posted, and you can edit or dismiss findings first.
- No hosted review bot and no GitHub App are required. A GitHub App may become an optional way to sign in and receive events for unattended setups.

What works today: [AI reviews](/docs/git/ai-reviews/) of local branches and diffs.
