/**
 * Capability content shared by the homepage, Product and Before & After, so
 * every page describes a capability the same way. Describe what people can
 * do, never how Vekrun does it internally.
 */

/** Kinds of projects Vekrun can work on. Compatibility, not certification. */
export const projectExamples: { logos: string[]; title: string; line: string }[] = [
  { logos: ['rails', 'postgres'], title: 'A Rails app with PostgreSQL', line: 'Models, migrations, background jobs and system tests.' },
  { logos: ['django', 'python'], title: 'A Django backend', line: 'APIs, the admin and the test suite.' },
  { logos: ['laravel', 'mysql'], title: 'A Laravel commerce app', line: 'Checkout, queues and feature tests.' },
  { logos: ['nextjs', 'react'], title: 'A Next.js frontend', line: 'Pages, components and browser checks.' },
  { logos: ['expo', 'react-native'], title: 'An Expo mobile app', line: 'Screens and flows, previewed in the simulator.' },
  { logos: ['flutter'], title: 'A Flutter app', line: 'One codebase for mobile and the web.' },
  { logos: ['swift', 'kotlin'], title: 'A Swift or Kotlin native app', line: 'Native iOS and Android projects.' },
  { logos: ['tauri', 'electron'], title: 'A Tauri or Electron desktop app', line: 'Desktop clients built on web technology.' },
];

/** The homepage's short tour of capabilities beyond its showcases. `href` is a Product anchor. */
export const highlights: { id: string; href: string; title: string; line: string }[] = [
  { id: 'experiments', href: '/product/#experiments', title: 'Measured experiments', line: 'Before-and-after performance, with invariants and a rehearsed rollback.' },
  { id: 'production', href: '/product/#production', title: 'Production to code', line: 'Errors and stack traces connected to the code and its context.' },
  { id: 'guardian', href: '/product/#guardian', title: 'PR Guardian', line: 'Fixes failing CI and requested changes when you’ve authorized it.' },
  { id: 'templates', href: '/product/#templates', title: 'Workflow Templates', line: 'Start from proven workflows, or take over work on an existing branch.' },
  { id: 'live', href: '/product/#browser', title: 'Interactive Browser', line: 'Point at the problem in your running app instead of describing it.' },
  { id: 'anywhere', href: '/product/#work-anywhere', title: 'Work Anywhere', line: 'Coming to Free: run the Factory on your own VPS, private from the first boot.' },
];

export type Comparison = { id: string; title: string; before: string; after: string; beforeDetail: string; afterDetail: string };

/** Before & After: eight moments from an engineering day. Illustrative, not customer quotes. */
export const comparisons: Comparison[] = [
  {
    id: 'starting', title: 'Starting work',
    before: 'You explain the repository again.', beforeDetail: 'Every new session starts with the same paragraph about how the project is laid out and why.',
    after: 'Vekrun already knows the project.', afterDetail: 'Engineering Memory supplies the structure, conventions and past decisions that matter to this task.',
  },
  {
    id: 'planning', title: 'Choosing an approach',
    before: 'You pick one design and hope.', beforeDetail: 'Two chats suggest two designs. You trust one, and only find out later whether it was right.',
    after: 'Vekrun builds both and compares the evidence.', afterDetail: 'A Council challenges the plan, and Competitive Engineering can build each approach and verify it against the same requirements.',
  },
  {
    id: 'implementation', title: 'Implementation',
    before: 'You supervise every step.', beforeDetail: 'Prompt, check, correct, repeat, and remember which change depends on which.',
    after: 'Work Items move through the workflow.', afterDetail: 'Dependencies are respected, independent work runs side by side, and Vekrun asks when a decision needs you.',
  },
  {
    id: 'verification', title: 'Verification',
    before: 'You check whether “done” is true.', beforeDetail: 'The agent says it works. You run the tests and click through the app to find out.',
    after: 'You review a Proof Pack.', afterDetail: 'Test results and checks for the exact revision, optional mutation challenges, and anything unchecked listed as a gap.',
  },
  {
    id: 'git', title: 'Git collaboration',
    before: 'You coordinate branches by hand.', beforeDetail: 'Naming branches, opening pull requests and chasing approvals for every change.',
    after: 'Vekrun follows your Git policies.', afterDetail: 'Pull requests arrive inside your branch rules, and nothing merges without the approvals you require.',
  },
  {
    id: 'feedback', title: 'Feedback',
    before: 'Screenshots and vague comments.', beforeDetail: '“The button looks off on my phone.” Which button, which screen, which build?',
    after: 'Reviewers use the app and point.', afterDetail: 'Live Share puts a supported preview in their browser, and each comment keeps its screen and revision.',
  },
  {
    id: 'knowledge', title: 'Project knowledge',
    before: 'Reasoning disappears into chats.', beforeDetail: 'Why a choice was made lives in a closed tab or someone’s memory.',
    after: 'Decisions keep their reasons.', afterDetail: 'Engineering Memory links each decision to its evidence, and the architecture map shows what it touches and how it changed.',
  },
  {
    id: 'models', title: 'AI provider flexibility',
    before: 'One subscription sets your limits.', beforeDetail: 'One coding agent’s models, prices and outages decide what you can do.',
    after: 'You choose the models.', afterDetail: 'OpenRouter, local models you download through Vekrun, and optional coding agents. Change them when you like.',
  },
];
