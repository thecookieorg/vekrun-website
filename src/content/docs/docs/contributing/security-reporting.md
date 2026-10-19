---
title: Security reporting
description: How to report a vulnerability privately, and what the project commits to.
sidebar:
  order: 5
---

Vekrun runs shell commands, edits files and calls model providers on your behalf. Security is a core requirement of the design, not a later feature.

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private vulnerability reporting on the repository once it is public, or email the maintainer at the address on the GitHub organisation profile. No dedicated security mailbox has been published yet; this page and the [security page](/security/) will carry it when one exists.

Include steps to reproduce, the platform and the Vekrun version. You will get an acknowledgement within seven days.

## In scope

- Any way for an agent, extension, MCP server, repository content or terminal output to act outside the user's permission policy.
- Any exposure of credentials in logs, the UI, the webview, tool inputs or remote hosts.
- Any way for a lost lease or crash to replay a non-idempotent side effect.
- Any bypass of the local API's authentication or private-bind default.
- Supply-chain issues in the build, release or update path.

## Design commitments

- Repository text, logs, model responses and tool results are untrusted input. The policy engine, not the prompt, is the control.
- Credentials live in the operating-system keychain and never cross into the webview.
- Deny is the default for every capability.
- Sandboxing limits differ per platform and are documented in the project's threat model.

## Supported versions

There are no releases yet. Once there are, the latest minor release is supported.
