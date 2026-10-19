---
title: First launch
description: What Vekrun shows when you start it today, and what the first-run experience will become.
sidebar:
  order: 2
---

Verified on macOS only, from a source build.

## What you see today

Vekrun opens to a window with its primary navigation areas and a real shell in the Terminal area. Areas that are not built yet say so in the interface and name the milestone that builds them; no screen pretends to be a feature.

Today the Terminal, Agents, Git, Board, Plan, Council and Factory areas exist with real behaviour behind them on macOS. A project picker in the top bar sets one open project for the whole application, remembers it, and starts new shells there.

The terminal works without any AI connection and without network access. Nothing about ordinary shell use depends on a model being configured.

## The intended first run

:::note[Partially built]
The first-run flow described in the specification, shell choice, then theme, then an optional AI setup, is not complete. The settings behind it (shell, theme) exist and persist through the Rust settings store, but the guided sequence is milestone 11 polish. See the [roadmap](/roadmap/).
:::

The intended sequence is:

1. Choose a shell.
2. Choose a theme.
3. Choose one of four AI options, or skip: run AI locally, connect an existing coding-agent account, bring an API key, or none.

Skipping AI is a complete, supported choice. Vekrun is a terminal first.

## Settings

Settings are stored by the Rust core in layered form: built-in defaults, then global, then per-project. A setting changed in the UI persists across restarts through that store, not through browser storage. Terminal settings (font, cursor, scrollback, shell, shell integration) apply live.
