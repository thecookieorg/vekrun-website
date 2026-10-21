---
title: Local testing
description: Docker and Compose environments and framework-aware test runs using the tools already in your project, planned.
sidebar:
  order: 3
---

:::note[Planned]
Docker integration and framework-aware testing are approved scope and not built yet. See the [roadmap](/roadmap/).
:::

These are local developer tools, not account integrations. Nothing here needs a cloud account.

## Docker and Compose

Discover whether Docker is available, inspect the containers that matter to the project, build images, start development services, run tests in an isolated environment, read sanitised logs, and stop the resources Vekrun created. Local development contexts are kept separate from any Docker context that reaches production.

A container is not a security boundary when the daemon or its socket grants wider host access. Host mounts, socket access, secrets, privileged containers, network exposure and destructive cleanup stay behind the same permissions as every other command.

## Framework-aware testing

Vekrun will detect the project's test runner and use it, starting with Playwright, Vitest, Jest, pytest, RSpec and Cypress. You get test selection, structured results where the framework provides them, failure summaries, relevant logs, retries, and the mapping from a failing test to the code it covers. The results feed the same verification evidence that agents and Factory already produce.

What works today: approved commands, including your test command, run in a coding session or a Factory task, and their output is evidence. See [Coding sessions](/docs/ai-coding/coding-sessions/).
