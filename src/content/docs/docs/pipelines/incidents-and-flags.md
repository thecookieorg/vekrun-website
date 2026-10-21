---
title: Incidents and feature flags
description: Incident tools and feature-flag platforms as context for investigations, with every consequential action left to you, planned.
sidebar:
  order: 6
---

:::note[Planned]
Incident management and feature-flag integrations are approved scope and not built yet. See the [roadmap](/roadmap/).
:::

## Incident management

Planned: PagerDuty and incident.io. The intended workflow is production incident, investigation, engineering work, verification. Vekrun will show active incidents, their timeline and affected services, link an incident to an Insights investigation, create follow-up tickets, hand remediation to Factory and draft a postmortem.

Acknowledging, closing or suppressing an incident always needs your authorisation.

## Feature flags and product analytics

Planned: LaunchDarkly, PostHog and GrowthBook, with Statsig as a further candidate. The purpose is correlation: when a latency regression or a new error appears after a rollout, an investigation can see the rollout timing and the affected services and recommend a mitigation and a repair plan.

Vekrun never changes a production flag. Any write to a flag platform is a separate permission that is off until you turn it on.

Related: [Insights overview](/docs/insights/overview/).
