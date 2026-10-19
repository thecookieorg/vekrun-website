---
title: Shell configuration
description: Which shells Vekrun runs and how to choose yours.
sidebar:
  order: 1
---

Vekrun runs your shell, not a replacement for it. Your existing configuration files load as they do in any other terminal.

## Supported shells

| Platform | Shells |
|---|---|
| macOS and Linux | Bash, Zsh, Fish and any other installed interactive shell |
| Windows | PowerShell, cmd and WSL distributions |

Windows shells compiled and passed their tests in automated checks early in the project, but they have not been used by hand and those checks are currently paused. Only macOS has been used by hand in the development build.

## Choose your default shell

Open Settings, then Terminal, and pick the shell new tabs start with. Tabs already open keep their shell.

## Where a shell starts

New shells start in the open project's folder. A shell opened from a ticket on the [Board](/docs/board/start-work/) starts in that ticket's worktree.

## Command details

If your shell reports where each command starts and ends (most can), Vekrun shows the exit code, how long the command took, a marker beside commands that failed, and the current directory. Turn this off in Settings if you prefer a plain terminal.

## Links and the clipboard

A link in terminal output opens only after Vekrun shows you the real address. Programs cannot write to your clipboard through the terminal; that is deliberate.
