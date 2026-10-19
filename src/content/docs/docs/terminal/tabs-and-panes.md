---
title: Tabs and splits
description: Several shells side by side, with splits that never restart a running shell.
sidebar:
  order: 2
---

## Tabs

Each tab is its own shell. Open, close and switch tabs with the keyboard; see [Keybindings](/docs/terminal/keybindings/).

## Splits

Split the focused pane side by side with `⌘D` or stacked with `⌘⇧D`, then drag the divider to resize. Splitting or resizing never restarts the shell inside a pane.

## Search

`⌘F` searches the scrollback of the focused pane.

## Restoring your layout

When you quit, Vekrun keeps each tab's layout and scrollback. On the next start the layout comes back, the old output appears under a divider marked as restored, and a fresh shell starts below it. Vekrun never shows a process as still running when it is not.

## Coming later

:::note[Planned]
Dragging tabs to rearrange them, named and pinned sessions, shell profiles, and optional command blocks with command search and bookmarks are planned. See the [roadmap](/roadmap/).
:::
