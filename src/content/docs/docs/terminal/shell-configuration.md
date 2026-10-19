---
title: Shell configuration
description: Which shells Vekrun runs, how it starts them, and the settings that control them.
sidebar:
  order: 1
---

Verified on macOS only. Windows shells pass CI but have not been verified by hand.

## Supported shells

| Platform | Shells |
|---|---|
| macOS, Linux | Bash, Zsh, Fish and any installed shell that behaves as a login or interactive shell |
| Windows | PowerShell, cmd and WSL distributions through ConPTY |

Vekrun does not replace or wrap your shell. It owns the pseudo-terminal, the process lifetime and the output path; your shell's own configuration files run unchanged.

## Choosing the default shell

Settings, then Terminal, lets you pick the shell new tabs start with. The choice persists through the Rust settings store and applies to the next tab you open. Running tabs are not restarted.

## Working directory

New shells start in the open project's directory, chosen from the project picker in the top bar. A worktree opened from the [Board](/docs/board/start-work/) starts its shell in that worktree.

## Shell integration

Vekrun reads the OSC 133 marks many shells emit (or can be configured to emit) to learn where each command starts and ends. With marks available it shows:

- the exit code of each command,
- how long each command took,
- a marker in the gutter on commands that failed,
- the current working directory.

If your shell does not emit marks, these features are absent and the terminal behaves as a plain terminal. Shell integration can be turned off in settings.

## Output handling

Output is coalesced in Rust before it reaches the renderer, with pause and resume as back-pressure. The result is a terminal that stays responsive under heavy output; the transport was measured before it was adopted, and xterm.js rendering is the ceiling, not the Rust path.

## Security policies on escape sequences

Hyperlinks open only after Vekrun shows the real URL. Clipboard writes from the terminal (OSC 52) are refused by design. Every such decision goes through the policy engine and is recorded in the audit journal.
