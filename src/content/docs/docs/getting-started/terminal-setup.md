---
title: Terminal setup
description: Shells, tabs, splits and the settings that make the terminal yours.
sidebar:
  order: 3
---

Verified on macOS only. PowerShell and WSL pass CI on Windows but have not been used by hand there.

## Shells

Vekrun runs genuine PTY-backed shells: Bash, Zsh and Fish on macOS and Linux, and PowerShell, cmd and WSL through ConPTY on Windows. Your shell configuration files are respected because the shell is your shell; Vekrun owns the process and the output path, not the shell itself.

Shell integration marks (the OSC 133 convention) give Vekrun command boundaries, so it can show exit codes, durations, a marker on failed commands and the working directory. Turn it off in terminal settings if you prefer a raw terminal.

## Tabs and panes

Open tabs with keyboard shortcuts. Split the current pane with `⌘D` (vertical) and `⌘⇧D` (horizontal) and resize with the draggable divider. A split never remounts a running shell. Search scrollback with `⌘F`.

See [Tabs and panes](/docs/terminal/tabs-and-panes/) and [Keybindings](/docs/terminal/keybindings/).

## Session restore

Layout and scrollback are restored after a restart. Restored scrollback sits under a divider that says it is restored, and a shell that was running when you quit is started fresh. Vekrun never claims a terminated process has resumed.

## Settings that apply live

Font, cursor style, scrollback length, default shell and shell integration are in Settings and take effect without restarting.

## Hyperlinks and the clipboard

Links in terminal output open only after Vekrun shows you the real URL. Writing to the clipboard from terminal output (OSC 52) is deliberately unsupported.
