---
title: Deployment verification
description: Connect a release to the code change that produced it and see what happened in production afterwards.
sidebar:
  order: 4
---

## What exists today

Insights already anchors its production observations on deployment markers from Sentry releases, Honeybadger deploys and AppSignal markers, and on a deploy you mark yourself. The comparison before and after, and its limits, are described in [Production verification](/docs/insights/production-verification/).

## Deployment platforms, planned

:::note[In development]
Observing deployments exists in the development build and is tested against recorded responses. Deployment actions, which always need explicit policy and approval, are planned. See the [roadmap](/roadmap/#delivery).
:::

Planned first: Vercel, Cloudflare Workers and Pages, Railway, Render and Fly.io.

Reads come first: discover deployments, see their status, link them to commits and services, inspect authorised logs, and keep track of environments and revisions. Writes such as triggering a deployment are a separate, explicitly authorised permission. A task finishing never deploys anything on its own.

## The distinction that matters

A successful deployment and a verified improvement are two different facts. Vekrun reports the first from the platform and the second only from monitoring data after the deployment, with the sample sizes shown. The intended chain is: error reported, fix delegated, pull request reviewed, deployment detected, recurrence observed or not.
