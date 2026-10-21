---
title: Overview
description: Failed builds, deployments and security findings as starting points for engineering work, all planned.
sidebar:
  order: 1
---

:::note[Planned]
Everything in this section is approved scope that is not built yet. These pages describe the intent. See the [roadmap](/roadmap/).
:::

Vekrun already turns a ticket or a production error into a reviewed change. This section covers the three other starting points that are coming.

## Failed build to working code

Open a failed CI run, see which job and test broke, let an agent investigate the failure against the exact commit, and repair it manually, with an AI agent or with Factory. Local tests run before the next CI result is read. See [CI/CD](/docs/pipelines/ci-cd/) and [Local testing](/docs/pipelines/local-testing/).

## Deploy and observe

Link a deployment to the change that produced it, inspect a failure, and let Insights compare production before and after. A deployment finishing is not the same as the problem being fixed. See [Deployment verification](/docs/pipelines/deployment-verification/).

## Security finding to verified fix

Findings from scanners become investigations and repair plans, with an independent check before a reviewable pull request. Nothing is suppressed or fixed in production on its own. See [Security findings](/docs/pipelines/security-findings/).

Incident tools and feature flags add context to investigations; see [Incidents and feature flags](/docs/pipelines/incidents-and-flags/).
