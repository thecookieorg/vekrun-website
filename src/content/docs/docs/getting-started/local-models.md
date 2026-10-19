---
title: Using local models
description: Run models on your own hardware through Ollama, LM Studio or any OpenAI-compatible local server.
sidebar:
  order: 5
---

Verified on macOS only.

## Detection

Vekrun detects installed local runtimes and reports two facts separately: whether the runtime is **installed** and whether its server is **reachable**. A runtime that is installed but not running shows as such, with no assumption that it will start on its own.

Supported today:

- **Ollama.** Detected when installed; models you have pulled are offered once the server is reachable.
- **LM Studio.** Detected when its local server is running; loaded models are offered.
- **Any OpenAI-compatible local server**, including llama.cpp-based servers, by pointing the OpenAI-compatible provider at its address. No preset exists for this yet.

## What local models are good for

A local model can run basic help and limited coding tasks on compatible hardware entirely offline. Heavier Factory workflows may need more capable hardware or a hosted provider. Vekrun says this rather than letting a task silently fail.

## Downloads and hardware guidance

:::note[Planned]
Guided model download inside Vekrun, with hardware detection, disk, memory and GPU estimates, and model licence display, is planned for milestone 3. Until then, install models with the runtime's own tools. Vekrun never bundles multi-gigabyte model weights in its installer. See the [roadmap](/roadmap/).
:::
