---
title: Validating the environment
description: Environment Discovery works out how a project runs, whether Docker Compose, native or a mix, and starts it with health checks.
sidebar:
  order: 4
---

Before a job can test its work, the project has to run. Environment Discovery works out how.

## What Discovery handles

- **Docker Compose projects.** Services from your Compose file, started and health-checked.
- **Native applications.** Rails, Node and Next.js, Python and similar projects, started the way your team starts them.
- **Hybrid projects.** Some services in containers, the app running natively.

In the development build, Discovery finds and runs real projects on the host. Review what it found, adjust anything it got wrong, and confirm.

:::note[Planned]
Saving the result as a reusable **Environment Recipe**, with seeds, tests and previews, and starting it inside each job’s isolated environment, are planned. See the [roadmap](/roadmap/#environments).
:::

Discovery covers most projects. Some will need a hint from you; it does not promise zero configuration for every repository.
