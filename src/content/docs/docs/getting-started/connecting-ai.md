---
title: Connecting AI
description: Add a provider with your own key, or use a model running on your machine. No Vekrun account, no Vekrun subscription.
sidebar:
  order: 3
---

Vekrun ships no model access of its own. You connect the providers you already use, and you pay them directly. There is no Vekrun account and no Vekrun subscription.

## Three ways to connect

1. **Your own API key.** Anthropic, OpenAI, Google Gemini, or any OpenAI-compatible endpoint. Works today.
2. **A model on your machine.** Vekrun detects Ollama and LM Studio. Works today; see [Choosing models](/docs/ai-coding/choosing-models/).
3. **An existing coding-agent account.** Planned, and only through documented sign-in flows. A consumer chat subscription is not an API key, and Vekrun will not pretend it is.

## Add a provider with an API key

1. Open Settings, then Providers.
2. Choose the provider, name the connection and paste your key.
3. Press **Test**. Vekrun makes a live request and tells you whether the key works.
4. Save.

The key is stored in your operating system's keychain, never in a plain file. Removing the connection deletes the key.

## What happens before anything is sent

The first time a session would send something to a hosted provider, Vekrun shows you exactly what is about to leave your machine and waits for you to press **Send**. See [Coding sessions](/docs/ai-coding/coding-sessions/).

## Costs

Hosted providers bill you at their own rates. Local models cost nothing per request. Vekrun shows usage per session and says "unknown" where a provider does not publish its pricing.
