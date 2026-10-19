---
title: Testing
description: The checks every change runs, and the rule that a claim needs a test.
sidebar:
  order: 4
---

Run each check separately and read its output. A filtered or chained command once hid a compile failure; exit codes matter.

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --exclude vekrun-desktop
pnpm -r typecheck
pnpm -r lint
pnpm -r test
```

`scripts/ci.sh` runs the same steps with per-step exit codes and is the merge gate while GitHub Actions is off.

## What the suites cover

- Rust unit, integration and property tests for the task state machine, leases, the policy engine, budget inheritance and delegation authority.
- Frontend unit tests for the desktop interface.
- Deterministic provider mocks, plus opt-in live tests against Anthropic, OpenAI and Gemini when you supply keys.
- An in-process SSH server test for the SSH client.
- Terminal transport measurements (the Spike results) recorded in the project record.

## Rules

- "Verified" and "stub" are the only two states. A screen is not a feature.
- Never say tests pass without having run them.
- A pass claimed for a platform needs evidence from that platform.

Desktop end-to-end tests through a driver for Tauri are unresolved; until that is settled, interface changes are reported as not browser-tested.
