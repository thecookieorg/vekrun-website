---
title: Overview
description: Failed builds, deployments and security findings as starting points for engineering work.
sidebar:
  order: 1
---

:::note[In development]
Reading CI runs, deployments and code-scanning findings exists in the development build and is tested against recorded responses. Each page says what is planned. See the [roadmap](/roadmap/#delivery).
:::

Vekrun already turns a ticket or a production error into a reviewed change. This section covers three other starting points.

## Failed build to working code

Open a failed CI run, see which job and test broke, let an agent investigate the failure against the exact commit, and repair it yourself or with a Factory job. Local tests run before the next CI result is read. See [CI/CD](/docs/pipelines/ci-cd/) and [Local testing](/docs/pipelines/local-testing/).

## Deploy and observe

Link a deployment to the change that produced it, inspect a failure, and let Insights compare production before and after. A deployment finishing is not the same as the problem being fixed. See [Deployment verification](/docs/pipelines/deployment-verification/).

## Security finding to verified fix

Findings from scanners become investigations and repair plans, with an independent check before a reviewable pull request. Nothing is suppressed or fixed in production on its own. See [Security findings](/docs/pipelines/security-findings/).

Incident tools and feature flags add context to investigations; see [Incidents and feature flags](/docs/pipelines/incidents-and-flags/).
