---
title: Connecting a monitoring account
description: Add a provider with your own credential, choose environments, and map projects to repositories.
sidebar:
  order: 3
---

Connecting a provider takes a credential you create in the provider's own settings. Vekrun stores it in your operating system's keychain and never writes it to its own files.

## What each provider needs

- **Sentry**: an auth token.
- **Honeybadger**: a personal auth token.
- **Datadog**: an API key, an application key and your Datadog site. Use a read-only application key unless you intend to change issue states from Vekrun.
- **AppSignal**: a personal API key.

:::note[Planned]
Signing in through Honeybadger's or AppSignal's hosted MCP server is not built. Both connect with a token today.
:::

## After connecting

- **Environments.** Choose which environments Vekrun syncs. Anything outside the list is never fetched.
- **Projects and repositories.** Map each monitoring project to a repository on your Board. You confirm each mapping; every action on an issue uses it to know where the code lives.
- **Retention.** Cached issues are kept for 30 days by default. Change the period in Settings, or clear the cache at any time.

## Write access

A connection starts read-only. If you want to resolve or reopen issues on the provider from Vekrun, turn on write access for that connection. Each change still asks for confirmation. See [security](/docs/insights/security/).

## Removing a connection

Removing a connection deletes its credential from the keychain and its cached issues.

In the development build these steps run against recorded provider responses; live accounts have not been exercised yet.
