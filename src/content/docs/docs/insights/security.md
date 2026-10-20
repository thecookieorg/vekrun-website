---
title: Security and sensitive monitoring data
description: Monitoring data can contain secrets and personal data. How Vekrun handles it, and what models can never do.
sidebar:
  order: 12
---

Error messages, stack traces and request data often carry things that should not travel: tokens, cookies, emails, query strings. Insights treats everything from a provider as sensitive and untrusted.

## Read-only by default

A connection can only read. Writing back to the provider, such as resolving an issue, is a separate switch per connection, off until you turn it on, and every write asks for confirmation. No agent mode can write to a provider at all.

## Redaction

When an issue is cached, Vekrun redacts messages, frame context lines, query strings, headers, cookies, email addresses and bearer or API tokens. Full occurrence payloads are fetched when you open them and never stored.

## Environments and retention

Only the environments you allow are synced. Cached issues expire after 30 days by default; change the period or clear the cache in Settings.

## Before anything reaches a model

An agent receives an issue as a redacted data block, and the egress preview shows exactly that block before it is sent. The provider credential never reaches an agent, a tool or a remote machine. See [permissions](/docs/ai-coding/permissions/).

## Audit and revocation

Every sync, write and agent action on an issue is recorded. Removing a connection deletes its credential from the keychain and its cached issues.

## What models never do

Deploy, run migrations, read secrets, or take destructive actions on your monitoring provider. Those paths do not exist.

A dedicated security review of Insights is still ahead of the first release; see the [roadmap](/roadmap/). To report a problem, see [credentials](/docs/settings/credentials/#reporting-a-vulnerability).
