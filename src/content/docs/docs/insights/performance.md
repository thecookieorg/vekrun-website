---
title: Investigating performance problems
description: Slow endpoints and performance incidents, and how Vekrun keeps measurement separate from guesswork.
sidebar:
  order: 5
---

Performance problems appear in the same list as errors; set the kind filter to performance to see only them.

## What the providers give you

- **Datadog**: the slowest endpoints of a service by p95 latency, shown as measurements with their window.
- **AppSignal**: performance and anomaly incidents with samples.
- **Sentry**: performance issues where the project reports them.
- **Honeybadger**: errors only at the moment.

Datadog trace search is not available yet.

## Measured, not guessed

When an agent investigates a performance issue, its report distinguishes three things: what the provider measured in production, what was measured locally during the investigation, and what is only a hypothesis. A suggested improvement is never presented as achieved until it is measured.

## From finding to fix

The actions are the same as for errors. **Investigate** produces a report with likely causes and the files involved. **Generate Fix Plan** turns it into steps you can edit. **Delegate to Factory** runs the incident workflow, including tests. After you deploy, [production verification](/docs/insights/production-verification/) compares the same measurement before and after.
