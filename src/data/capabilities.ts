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

/** The homepage's short tour of capabilities beyond the three showcases. */
export const highlights: { id: string; title: string; line: string }[] = [
  { id: 'council', title: 'Council', line: 'Different models weigh in on important decisions, and objections stay on record.' },
  { id: 'browser', title: 'Interactive Browser', line: 'Point at the problem in your running app instead of describing it.' },
  { id: 'delivery', title: 'Git and delivery', line: 'Work Items, dependencies and pull requests, inside your branch policies.' },
  { id: 'environments', title: 'Environment setup', line: 'Supported toolchains and services prepared for your project.' },
  { id: 'voice', title: 'Voice and Brainstorm', line: 'Talk a problem through, then turn the decision into work.' },
  { id: 'apps', title: 'Mobile and desktop apps', line: 'Build for iOS, Android, Expo, Flutter and desktop, not only the web.' },
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
    id: 'planning', title: 'Planning',
    before: 'You reconcile several AI sessions yourself.', beforeDetail: 'Two chats suggest two designs, and you decide which one to trust.',
    after: 'Vekrun organizes the plan.', afterDetail: 'Planning is part of the workflow, with a Council weighing in where a decision deserves more than one view.',
  },
  {
    id: 'implementation', title: 'Implementation',
    before: 'You supervise every step.', beforeDetail: 'Prompt, check, correct, repeat, and remember which change depends on which.',
    after: 'Work Items move through the workflow.', afterDetail: 'Dependencies are respected, independent work runs side by side, and Vekrun asks when a decision needs you.',
  },
  {
    id: 'verification', title: 'Verification',
    before: 'You check whether “done” is true.', beforeDetail: 'The agent says it works. You run the tests and click through the app to find out.',
    after: 'You review a Proof Pack.', afterDetail: 'Test results and checks for the exact revision, with anything unchecked listed as a gap.',
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
    after: 'Decisions keep their reasons.', afterDetail: 'Engineering Memory links each decision to the work and the evidence behind it.',
  },
  {
    id: 'models', title: 'AI provider flexibility',
    before: 'One subscription sets your limits.', beforeDetail: 'One coding agent’s models, prices and outages decide what you can do.',
    after: 'You choose the models.', afterDetail: 'OpenRouter, local models you download through Vekrun, and optional coding agents. Change them when you like.',
  },
];
