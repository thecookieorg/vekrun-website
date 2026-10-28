---
title: Delegating to Factory
description: Hand a production issue to a coordinated team that investigates, fixes, tests and verifies, and stops before deployment.
sidebar:
  order: 9
---

**Delegate to Factory** runs the built-in incident workflow with the issue as its input.

## The incident workflow

1. **Investigate**: a read-only agent produces the structured report.
2. **Reproduce**: a failing test or a recorded trigger where one can be found.
3. **Plan**: steps and acceptance criteria, waiting for your approval.
4. **Implement**: agents work on their own branches in separate working copies.
5. **Test**: the commands you allow run in each working copy.
6. **Verify**: a different agent checks the change against the plan with evidence.
7. **Review**: a reviewable diff, ready for you.

Nothing deploys. The workflow ends with a change you review and merge, or send back.

## What you control

The plan approval, every command and write according to your permissions, the budget and the number of agents, and the merge. Tasks can be paused, redirected or reassigned while they run.

The issue reaches the agents as a redacted data block, shown in the egress preview before it is sent. Agents never receive the provider credential.

The investigation's status moves with the work: investigating, fix in progress, in review, and so on. It never changes the provider's own status. See [reviewing repairs](/docs/insights/reviewing-repairs/) and [Factory](/docs/factory/overview/).
