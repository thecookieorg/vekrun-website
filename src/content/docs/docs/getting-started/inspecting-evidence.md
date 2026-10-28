---
title: Inspecting the evidence
description: Read what a job ran, what passed, what failed and what was not run, before you review its pull request.
sidebar:
  order: 6
---

A job is not done because an agent says so. Before you review, look at the evidence.

## What exists today

- **Structured test results**, with pass, fail and not-run states.
- **An independent verifier**, which checks the result against the goal separately from the agent that did the work.
- **Pull requests** opened with the plan and results, ready for your review. Your branch protections decide what merges.

:::note[Planned]
**Proof Packs**, which gather tests, browser runs with screenshots and video, the exact revision and the verifier’s notes into one record attached to the pull request, are planned, along with Verification Profiles and Feature Maps. See [Verification](/features/verification/) and the [roadmap](/roadmap/#verification).
:::
