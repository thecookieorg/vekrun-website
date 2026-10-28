---
title: Generating a fix plan
description: Turn an investigation into steps, files, acceptance criteria and tests you can edit and approve.
sidebar:
  order: 8
---

**Generate Fix Plan** starts a Plan session with the issue and, when one exists, the investigation report as context.

## What a plan contains

- The goal, stated as what production should look like once the fix lands.
- Steps with the files each touches and the dependencies between them.
- Acceptance criteria and the tests that will prove them.
- Risks and anything the investigation left uncertain.

You can edit any part of the plan before approving it. Nothing is built from a plan you have not approved.

## Council, if you want it

A plan can be sent to an incident Council before approval. Several models evaluate it independently and challenge one another; disagreements are recorded rather than voted away. See [Council](/docs/factory/council/).

## From plan to work

An approved plan becomes Factory tasks with traceability back to the issue and the investigation, or you can take the plan into a single coding session yourself. See [delegating to Factory](/docs/insights/delegating-to-factory/) and [Planning](/docs/factory/planning/).
