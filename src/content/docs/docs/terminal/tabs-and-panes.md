---
title: Tabs and panes
description: Multiple shells side by side, with splits that never restart a running shell.
sidebar:
  order: 2
---

Verified on macOS only.

## Tabs

Each tab is an independent shell. Open, close and switch tabs with the keyboard; see [Keybindings](/docs/terminal/keybindings/).

## Splits

Split the focused pane with `⌘D` (side by side) or `⌘⇧D` (stacked). Drag the divider to resize. A pane keeps its identity through layout changes: splitting, resizing or rearranging never remounts the shell inside it. That rule was established after an early bug and now governs every pane layout Vekrun adds.

## Search

`⌘F` searches the scrollback of the focused pane.

## Session restore

When you quit, Vekrun saves each tab's layout and scrollback. On the next start the layout is rebuilt and the old scrollback is shown under a divider labelled as restored. Shells start fresh below that divider. Vekrun never shows a process as alive when the operating system process is gone.

## Not yet built

:::note[Planned]
Dragging tabs to rearrange them, named and pinned sessions, shell profiles, and optional command blocks with command search and bookmarks are part of milestone 2 and not merged yet. See the [roadmap](/roadmap/).
:::
