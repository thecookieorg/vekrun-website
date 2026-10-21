---
title: CI/CD
description: GitHub Actions and GitLab CI/CD runs, failures and logs, with an Investigate Failure action, planned.
sidebar:
  order: 2
---

:::note[Planned]
CI/CD integration is approved scope and not built yet. See the [roadmap](/roadmap/).
:::

## What it will cover

GitHub Actions through the existing GitHub connection: workflows, runs, jobs, check results, failure annotations, authorised logs, and the commit and pull request each run belongs to. GitLab CI/CD through the existing GitLab connection: pipelines, jobs, failures, logs and merge-request correlation.

## Investigate Failure

From a failed run or check:

1. Vekrun fetches the failure details and ties the run to its exact commit.
2. An agent identifies the likely failing files or tests and inspects the repository.
3. You get a repair plan and choose Manual, AI Agent or Factory.
4. Approved changes are applied and local tests run.
5. The next CI result is read and shown next to the repair.

## The rule

A failure is not fixed because local tests passed. Vekrun reports the repair as verified only when the subsequent CI run says so, and says "inconclusive" when it cannot tell.

Framework-aware test runs are described under [Local testing](/docs/pipelines/local-testing/).
