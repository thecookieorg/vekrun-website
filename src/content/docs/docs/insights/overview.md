---
title: Insights overview
description: Connect your monitoring tools and turn production errors and slow requests into tickets, plans and verified fixes.
sidebar:
  order: 1
---

Insights is the workspace where production problems become engineering work. You connect the monitoring tools you already use, see their errors and performance problems inside Vekrun, and act on them: investigate, create a ticket, generate a fix plan, or hand the repair to an AI team.

Your monitoring provider stays the source of truth. Vekrun reads from it, keeps a redacted local cache so you can work offline, and writes back only when you have turned that on.

## The workflow

**Production problem → Investigate → Plan → Fix → Test → Review → Verify.**

1. An error or a slow endpoint appears in the issue list.
2. Open it to read the stack trace, occurrences and timeline.
3. Choose an action: **Investigate**, **Create Ticket**, **Generate Fix Plan** or **Delegate to Factory**.
4. Review the resulting change like any other.
5. Mark the deploy and compare production before and after.

## What works in the development build

Connections to Sentry, Honeybadger, Datadog and AppSignal exist in source and are tested against recorded responses; none has been run against a live account yet. The issue list, detail view, the four actions, incident Council, investigation statuses, Board links and deployment observation all work on macOS.

## In this section

- [Supported providers](/docs/insights/providers/) and [connecting an account](/docs/insights/connecting/).
- [Viewing errors](/docs/insights/viewing-errors/) and [performance problems](/docs/insights/performance/).
- [Investigate & Fix](/docs/insights/investigate-and-fix/), [tickets](/docs/insights/creating-tickets/), [plans](/docs/insights/generating-plans/), [Factory](/docs/insights/delegating-to-factory/).
- [Reviewing repairs](/docs/insights/reviewing-repairs/) and [production verification](/docs/insights/production-verification/).
- [Security and sensitive data](/docs/insights/security/).

See also the [Insights feature page](/features/insights/) and the [roadmap](/roadmap/).
