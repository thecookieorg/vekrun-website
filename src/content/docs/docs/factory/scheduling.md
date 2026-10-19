---
title: Scheduling
description: Recurring and event-triggered work, with the host requirements stated up front.
sidebar:
  order: 4
---

:::caution[Not built yet]
Scheduling, standing orders and event triggers are milestone 9 and have not started. This page describes design intent. See the [roadmap](/roadmap/).
:::

## Intent

- One-time and recurring schedules, cron-compatible, with time zones.
- Event triggers from Git, CI and webhooks where you configure them.
- Standing orders: instructions that apply to every run of a kind of task.
- Deduplication, resource bounds, a run history with paused and running states, and a policy for missed runs.

## Honesty about hosts

A schedule will always state which host must be running for it to fire. A desktop-only setup cannot run anything while the window is closed; a local worker daemon can; a remote worker can while that machine is up. Vekrun will never claim execution on a powered-off machine. See [Remote workers](/docs/advanced/remote-workers/).
