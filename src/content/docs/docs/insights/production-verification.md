---
title: Production verification
description: Mark a deploy and let Vekrun compare the same window before and after, with honest verdicts.
sidebar:
  order: 11
---

A fix is only done when production says so. Vekrun keeps count snapshots from every sync, which lets it compare an issue before and after a deployment.

## How it works

1. Deploy the change as you normally do. Vekrun never deploys.
2. **Mark deployed** on the investigation. Vekrun records the moment and the baseline window before it.
3. After the same length of time has passed, it compares occurrence counts, and for performance issues the measured latency, in the window after.

## The verdicts

- **Improved**: the problem occurred less, or the measurement got better, by more than noise.
- **Regression**: it occurred more, or got worse.
- **Inconclusive**: not enough samples yet, or the windows are too short to say.

Every verdict shows the sample sizes and the windows it was based on, so a quiet weekend is not mistaken for a fix.

## Investigation status

Verification moves the investigation to verified, or back to open. **Resolved** is set only by you. If write access is on for the connection, you can also resolve the issue on the provider, after a confirmation.

:::note[Planned]
Using the provider's own release or deploy records as the deployment signal is not built; today you mark the deploy yourself.
:::
