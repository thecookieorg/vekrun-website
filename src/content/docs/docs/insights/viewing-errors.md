---
title: Viewing errors
description: The issue list, filters, and what an issue's detail view shows.
sidebar:
  order: 4
---

The Insights list shows issues from every connected provider in one place. Counts are shown per provider, because each one counts differently.

## Filtering

Filter by provider, project, environment, status and kind. The kind filter separates errors from performance problems. Text search matches titles and messages.

## Issue details

Select an issue to see everything Vekrun has cached about it:

- The message, the grouped error and its provider link.
- The stack trace of the latest occurrence, with the frames that point at your code.
- An occurrence timeline built from Vekrun's own sync snapshots, so you can see whether the issue is new, steady or growing.
- Affected environments and releases where the provider exposes them.
- Any investigation, ticket, plan, Factory task or pull request already linked to it.

Sensitive values in messages, frame context, query strings, headers, cookies and emails are redacted when the issue is first cached. Full occurrence payloads are fetched on demand and are not stored.

## Two statuses

Each issue carries the provider's own status and, separately, Vekrun's investigation status. A finished coding task never resolves the issue on the provider; only you do that, and only if write access is on.

## Working offline

When a provider is unreachable, the list shows cached issues and marks them as cached.

Next: [performance problems](/docs/insights/performance/) and [Investigate & Fix](/docs/insights/investigate-and-fix/).
