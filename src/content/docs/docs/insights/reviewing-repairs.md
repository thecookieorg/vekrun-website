---
title: Reviewing repairs
description: Where a fix lands, what evidence comes with it, and how it links back to the issue and the ticket.
sidebar:
  order: 10
---

A repair, whether you wrote it, a single agent proposed it or Factory produced it, ends as a diff for your review.

## What you see

- The change itself, file by file.
- The tests that ran, with their output.
- For Factory work, the verification report from a separate agent: what it ran, what passed, what it could not check.
- Links back to the issue, the investigation report, the ticket and the plan, so the reasoning is one click away.

## Review options

Review the diff in Vekrun, ask a model to look for problems first, or compare findings from several models. Approve the merge, or send it back with notes. The merge happens only when you approve it.

## After merging

Merging closes the Factory task and updates the investigation status. It does not resolve the issue on the provider and does not deploy. The next step is yours: deploy as you normally do, then [mark the deploy](/docs/insights/production-verification/) so Vekrun can compare production before and after.

Pull-request creation from a repair and status posted back to the tracker are tracked on the [roadmap](/roadmap/).
