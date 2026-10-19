---
title: Connecting an AI provider
description: The three ways Vekrun connects to models, and how to add a provider with your own API key.
sidebar:
  order: 4
---

Verified on macOS only.

Vekrun ships no model access of its own. You connect the providers you already use, and you pay them directly. There is no Vekrun account and no Vekrun subscription.

## Three connection types

The provider manager keeps these visibly distinct:

1. **Your API key or endpoint.** Direct provider billing. The key goes into the operating system keychain. Available today for Anthropic, OpenAI, Google Gemini and any OpenAI-compatible endpoint.
2. **An existing coding-agent account.** Optional compatibility for subscriptions you already have, through documented auth flows only. Planned in milestone 3; see the [roadmap](/roadmap/). Vekrun's own agents never depend on it.
3. **Local models.** Runtimes on your own machine. See [Using local models](/docs/getting-started/local-models/).

A consumer chat subscription does not include API access. Vekrun will not pretend otherwise.

## Adding a provider with an API key

1. Open Settings, then Providers.
2. Choose the provider, give the connection a name and paste the key.
3. Use **Test** to make a live request. The result tells you whether the key works.
4. Save. The key is written to the keychain; the settings store keeps only a secret-free reference to it.

Removing a connection deletes its key from the keychain.

## What the key can and cannot do

- A key never appears in a log, in the webview, or in full in any UI element.
- Vekrun never injects a key into tools, shells or remote hosts.
- The first time a session would send anything to a hosted provider, the [egress preview](/docs/ai/context-management/) shows exactly what is about to leave your machine and waits for you to press Send.

## Capability registry

Each provider's models are listed with what Vekrun knows about them: tool calling, context size, limits and pricing where the provider publishes it. Where the provider does not publish a fact, Vekrun records it as unknown rather than guessing.

Transient provider errors are retried with backoff.
