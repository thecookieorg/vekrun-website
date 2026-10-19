---
title: Ticket synchronisation
description: How status, comments and pull-request links will flow back to the provider.
sidebar:
  order: 4
---

:::caution[Not built yet]
Synchronisation to external providers is milestone 8 (the sync engine against the Local source) and milestone 10 (live adapters). This page describes design intent. See the [roadmap](/roadmap/).
:::

## Intent

- A ledger with idempotency keys records every outbound write, so a retried write never duplicates a comment or a transition.
- Outbound status transitions are acknowledged by the provider before the Board shows them as done.
- Comments and pull-request links are written back where the provider supports it.
- Conflicts between local and remote state are detected, retried within bounds, and surfaced rather than resolved silently.
- Synchronisation loops and duplicate ticket creation are prevented by design.
- An optional authenticated webhook endpoint on a worker you run can receive provider events, with signature checks, replay protection and deduplication.
