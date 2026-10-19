---
title: Contributing
description: Build from source, run the checks, and land a change once the repository is public.
sidebar:
  order: 7
---

:::note[Repository not yet public]
The desktop repository has not been published. The process below is what the project uses internally and will apply unchanged once it opens.
:::

## What helps most right now

Vekrun is early. The most useful contributions are review of the architecture and contracts, platform testing on Windows and Linux, and issues that name a specific requirement.

## Build from source

Prerequisites: Rust stable through [rustup](https://rustup.rs), Node 22 or newer, pnpm 12, and the [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) for your platform.

```bash
pnpm install
cargo test --workspace --exclude vekrun-desktop   # also generates the TypeScript bindings
pnpm -r typecheck && pnpm -r lint && pnpm -r test
pnpm dev                                          # desktop app through `tauri dev`
cargo run -p vekrun-cli -- version                # headless CLI
```

The bindings in `packages/ipc/src/generated/` are produced by the Rust tests. If you change a type in `crates/vekrun-types`, commit the regenerated bindings.

## The checks

Run each separately and read its output; a filtered or chained command once hid a compile failure.

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --exclude vekrun-desktop
pnpm -r typecheck
pnpm -r lint
pnpm -r test
```

The suites cover: Rust unit, integration and property tests for the task state machine, leases, the policy engine, budget inheritance and delegation authority; frontend unit tests; deterministic provider mocks plus opt-in live tests against Anthropic, OpenAI and Gemini when you supply keys; an in-process SSH server test; and the terminal transport measurements.

## The merge gate

GitHub Actions is switched off for the repository for now, by the owner's decision on 2026-10-19. `scripts/ci.sh` mirrors the workflow step by step with per-step exit codes, and a green run on the developer's machine is the gate; its last line names the host operating system. Windows and Linux are unverified until Actions is back on, and every pull-request note says so. Desktop end-to-end tests through a Tauri driver are unresolved; interface changes are reported as not browser-tested.

## Ground rules

- Rust owns behaviour; the UI renders. A pull request that puts business logic in TypeScript will be asked to move it.
- No fake features. A screen is not a feature. Empty states say what is not built and which milestone builds it.
- No silent scope changes. If a requirement is wrong or conflicts with another, open an issue naming the conflict and proposing the change.
- Every side effect goes through the policy engine.
- Platform claims need evidence: "works" means on which operating system, verified how. "Verified" and "stub" are the only two states.

## Workflow

1. Open or pick an issue. Say which milestone and component it belongs to.
2. Branch from `main` as `type/short-slug` (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`).
3. Run the checks above, each separately.
4. If you changed a type in `crates/vekrun-types`, commit the regenerated bindings.
5. Open a pull request using the template. Say what you tested and on which platform.

Commits are small and atomic, in the imperative mood. Architectural decisions go in `docs/adr/` as numbered ADRs marked "proposed". The project follows the Contributor Covenant.

## Extensions

:::note[Planned]
The extension host, SDK and community index are not built yet; there is nothing to build against. The design: versioned manifests with declared capabilities reviewed at install; enable, disable, update and remove; a local development kit; a WebAssembly component host with capability-scoped imports, with the capability set restricted and documented if the runtime cannot sandbox adequately; no extension can bypass the central policy engine.
:::

Security reports go through [Credentials: reporting a vulnerability](/docs/settings/credentials/#reporting-a-vulnerability), never a public issue.
