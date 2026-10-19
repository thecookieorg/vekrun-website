---
title: AI reviews
description: Ask a model to find problems in a change, and have several models check each other.
sidebar:
  order: 4
---

## Review a change

Start a session in Review mode and point it at a branch or a diff. The agent reads the change and reports findings with file and line references. It does not edit anything.

## A second opinion

For a change that matters, convene a [Council](/docs/ai-teams/council/): several models review independently, challenge each other's findings, and a report records where they disagree. You decide what to act on.

## Your approval

Findings are suggestions. Nothing is posted, merged or changed on your behalf.

:::note[Planned]
Inline suggestions on a pull request, findings grouped by category such as security and correctness, and posting a review to GitHub or GitLab are planned. See the [roadmap](/roadmap/).
:::
