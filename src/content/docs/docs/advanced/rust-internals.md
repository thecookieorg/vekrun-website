---
title: Rust internals
description: The control plane, the policy engine, the terminal transport and the Git and file services, as implemented.
sidebar:
  order: 2
---

Everything on this page is merged on the main branch with tests and has been run by hand on macOS. Windows and Linux pass continuous integration only.

## Control plane

- **Task contracts** in `vekrun-types`: `Task`, a fourteen-state enum (draft, ready, queued, claimed, running, waiting-on-dependency, waiting-for-approval, verifying, integrating, blocked, failed, cancelled, completed, archived), the legal transition table, `Lease`, `AuditEvent`, `PolicyDecision`. Property tests reject arbitrary illegal transitions.
- **Store**: SQLite through a migration runner; transactional transitions; an append-only journal enforced by triggers; leases with deadlines. A task that finishes lands in *verifying*, never in *completed* by its own report.
- **Hierarchy**: manager and worker roles; delegation depth and concurrent-agent caps; a child task's budget and tool authority are bounded by its parent's, property-tested; managers wait for children.
- **Verification and integration**: a verifier that receives objective, criteria, change set and artifacts, never the implementer's self-assessment; a report contract that refuses a pass without evidence; bounded repair tasks with escalation; an integrator that previews the merge through `git merge-tree` and requires approval before touching protected state.
- **Snapshots**: uncommitted state captured before risky turns and integration; previewed, selective, undoable restore that skips files with unsaved editor changes.
- **Agent Inbox**: one prioritised list over approvals, escalations, decisions, reviews and blocked tasks, across every session.

## Policy engine and credentials

A capability enum, deny by default, one decision and one audit row per request. Policy inputs are never prompt text: repository content, instruction files, tool results, terminal output and model replies are data. Credentials live in the OS keychain behind a secret-free index with a migration ledger; keys are deleted when a provider is removed; nothing crosses into the webview. Before an agent command runs, an isolation check reports what the host can enforce; operations that need isolation the OS cannot provide fail closed. Per-call approval is mandatory and no auto-approve control exists until OS-enforced sandboxes land.

## Terminal

PTY sessions are owned in Rust with output coalescing and pause/resume as back-pressure, adopted after a measured spike: a raw channel plus coalescing, with xterm.js rendering as the throughput ceiling (about 12 MB/s), and a Rust-side terminal model tapped off the coalescer at about 245 MB/s that backs the `read_terminal` tool and the OSC policy. Shell integration marks (OSC 133) provide exit codes, durations and cwd. Hyperlinks open only after the real URL is shown; OSC 52 clipboard writes are refused by design. SSH uses `russh` with strict host keys and an in-process server test. Session restore rebuilds layout and scrollback under an honest divider and never claims a dead process is alive.

## Provider gateway

Streaming adapters for Anthropic, OpenAI-compatible endpoints and Gemini, each with deterministic mocks and opt-in live tests; a capability registry that records "unknown" rather than inventing context sizes or prices; routing profiles (explicit, quality, latency, cost, balanced, custom); a budget hierarchy global > project > team > agent > task where a child cannot expand a limit; a usage ledger; retries with backoff on transient errors; fallbacks only when policy allows. Ollama and LM Studio detection reports *installed* and *reachable* separately.

## Files and Git

Git runs through the user's installed `git` for anything that writes (commit, switch, branch, stash, worktree) so hooks and credential helpers apply; reads use a Rust Git library. Nothing is forced; destructive actions need confirmation and are audited. The file service lists under `git check-ignore`, refuses paths outside the project, caps reads, refuses binaries, and writes only when the hash the editor last read still matches the disk, otherwise it reports a conflict. Monaco is bundled locally with its workers; nothing loads from a CDN.

See [Architecture](/docs/advanced/architecture/) for the component map and [Progress](/docs/advanced/progress/) for milestone status.
