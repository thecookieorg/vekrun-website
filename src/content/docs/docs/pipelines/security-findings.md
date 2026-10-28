---
title: Security findings
description: Scanner findings become investigations and reviewable fixes, with an independent check and no automatic remediation.
sidebar:
  order: 5
---

:::note[In development]
Reading GitHub Code Scanning findings exists in the development build and is tested against recorded responses. Semgrep, SonarQube and Snyk are planned. See the [roadmap](/roadmap/#delivery).
:::

## Sources

GitHub Code Scanning and CodeQL, which extend the existing GitHub connection rather than adding a separate account, plus Semgrep, SonarQube Cloud and Server, and Snyk.

## The workflow

Find an issue. Prepare a fix. Verify it.

1. A finding arrives with its severity, affected files and code locations, tied to the repository.
2. Vekrun checks whether a ticket already exists for it.
3. An agent investigates and proposes a repair plan.
4. The repair is implemented with your approval and checked by a different agent.
5. You get a reviewable pull request.

## What Vekrun will not do

- Suppress a finding, weaken a scanner policy, or mark a vulnerability fixed without verification.
- Change anything in production. Remediation ends at a pull request you review.

Scanner output is treated as untrusted input, like every other external text, so it cannot change what an agent is allowed to do. See [Permissions](/docs/ai-coding/permissions/).
