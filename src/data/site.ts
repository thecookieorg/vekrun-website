/**
 * Single source of truth for product positioning, navigation and availability.
 * Components never hardcode a product status string; they import from here.
 */

export const site = {
  name: 'Vekrun',
  domain: 'vekrunapp.com',
  url: 'https://vekrunapp.com',
  /** Brand tagline. */
  tagline: 'Your terminal. Your models. Your rules.',
  /** Homepage headline and subheading. */
  headline: 'Your terminal. Your AI. Your workflow.',
  subheading: 'Code with your favorite AI, manage tasks, review pull requests, and run coding agents, all in one terminal.',
  description:
    'Vekrun is a free, open-source AI-native terminal and developer workspace. Use your preferred AI models, write code, manage tickets, review pull requests, coordinate AI coding teams and turn production errors into verified fixes, in one application.',
  shortDescription: 'A free, open-source AI-native terminal. Your models, your tasks, your code reviews, in one place.',
  license: {
    name: 'Apache License 2.0',
    spdx: 'Apache-2.0',
    status: 'proposed, subject to final review',
  },
  /** Public, verifiable project state. Update this when the status changes. */
  status: {
    label: 'In development',
    /** Last date the roadmap and availability data were reconciled with the desktop project. */
    asOf: '2026-10-21',
    /** One sentence, used once per page at most. */
    line: 'Vekrun is in development. There are no public releases yet.',
    /** What the "in development build" status means. Used in legends only. */
    meaning: 'Implemented in development means the feature works in the current source on macOS and is not in any public release. Windows and Linux are not yet verified by hand.',
  },
  repo: {
    org: 'thecookieorg',
    name: 'vekrun',
    /** The desktop application repository. Flip to true once it is public; GitHub links render only then. */
    public: false,
    url: 'https://github.com/thecookieorg/vekrun',
  },
  websiteRepo: {
    name: 'vekrun-website',
    public: true,
    url: 'https://github.com/thecookieorg/vekrun-website',
  },
  contact: {
    securityEmail: null as string | null,
    generalEmail: null as string | null,
    discussionsUrl: null as string | null,
  },
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: 'Features', href: '/features/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Roadmap', href: '/roadmap/' },
];

export const primaryCta = {
  label: 'See how it works',
  href: '/#board',
  releasedLabel: 'Download Vekrun',
  releasedHref: '/download/',
};

/** The five product stories. Order is the order they appear everywhere. */
export const featurePages: (NavItem & { key: string })[] = [
  { key: 'terminal', label: 'Terminal', href: '/features/terminal/', description: 'A modern terminal for everyday work, with tabs, splits, SSH and search.' },
  { key: 'ai-coding', label: 'AI coding', href: '/features/ai-coding/', description: 'Code with Claude, OpenAI, Gemini or a local model, on your terms.' },
  { key: 'board', label: 'Board', href: '/features/board/', description: 'Your assigned tickets, one click from a branch, a terminal and an agent.' },
  { key: 'ai-teams', label: 'AI Teams', href: '/ai-teams/', description: 'Plan, build, test and verify larger work with coordinated agents.' },
  { key: 'code-review', label: 'Code reviews', href: '/features/code-review/', description: 'Pull requests, AI findings and your feedback in one place.' },
  { key: 'insights', label: 'Insights', href: '/features/insights/', description: 'From a production error to a verified fix, with your monitoring tools connected.' },
];

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      ...featurePages.map(({ label, href }) => ({ label, href })),
      { label: 'Integrations', href: '/integrations/' },
      { label: 'Download', href: '/download/' },
    ],
  },
  {
    title: 'Project',
    items: [
      { label: 'Documentation', href: '/docs/' },
      { label: 'Roadmap', href: '/roadmap/' },
      { label: 'Open source', href: '/open-source/' },
      { label: 'Contributing', href: '/docs/advanced/contributing/' },
      { label: 'License', href: '/open-source/#license' },
    ],
  },
  {
    title: 'Trust',
    items: [
      { label: 'Security', href: '/security/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/**
 * One availability vocabulary for features, integrations and the roadmap.
 * Three statuses. Keep the strings here; never duplicate them in components.
 */
export const availability = {
  available: {
    label: 'Implemented in development',
    description: 'Works in a development build with verification evidence. Not in a public release.',
    tone: 'ok',
  },
  'in-development': {
    label: 'In progress',
    description: 'Implementation exists or is under way, but the full advertised workflow or its verification is outstanding.',
    tone: 'warn',
  },
  planned: {
    label: 'Planned',
    description: 'Approved scope with no complete implementation yet.',
    tone: 'muted',
  },
  proposed: {
    label: 'Proposed',
    description: 'A possible future integration, not yet approved or scheduled.',
    tone: 'faint',
  },
} as const;

export type Availability = keyof typeof availability;

/** Roadmap uses the same three statuses plus "released" for public builds. */
export const roadmapStatuses = {
  implemented: availability.available,
  'in-progress': availability['in-development'],
  planned: availability.planned,
  proposed: availability.proposed,
  released: { label: 'Released', description: 'Available and verified in a public Vekrun release.', tone: 'info' },
} as const;

export type RoadmapStatus = keyof typeof roadmapStatuses;

/** Roadmap areas, in display order. */
export const roadmapAreas = {
  terminal: 'Terminal',
  'ai-coding': 'AI coding and models',
  board: 'Board and issue tracking',
  'ai-teams': 'AI Teams',
  'code-review': 'Code reviews',
  insights: 'Insights and monitoring',
  'ci-cd': 'CI/CD and testing',
  deployment: 'Deployment and verification',
  security: 'Security and quality',
  integrations: 'Integrations and automation',
  releases: 'Desktop release',
} as const;

export type RoadmapArea = keyof typeof roadmapAreas;

/** Integration categories, by purpose. */
export const integrationCategories = {
  'ai-models': { label: 'AI models', description: 'Hosted providers you connect with your own key, and models you run locally.' },
  'coding-tools': { label: 'Coding tools', description: 'Accounts, machines and tools your coding sessions can use.' },
  'project-management': { label: 'Project management', description: 'Where your tickets live. Connect one and they appear on the Board.' },
  'git-hosting': { label: 'Git and code hosting', description: 'Branches, pull requests and the link between a ticket and its changes.' },
  monitoring: { label: 'Monitoring and incidents', description: 'Error tracking, performance and incident tools. Connect one and production problems become work you can investigate and fix.' },
  'ci-cd': { label: 'CI/CD and testing', description: 'Build pipelines and test frameworks. Open a failed run, see what broke, and repair it where you code.' },
  deployment: { label: 'Deployment and hosting', description: 'Know what happened after a deploy: link a release to its change and watch the production signals.' },
  security: { label: 'Security and code quality', description: 'Scanner findings become investigations and reviewable fixes. Nothing is remediated in production automatically.' },
  'flags-analytics': { label: 'Feature flags and analytics', description: 'Correlate rollouts and product changes with errors and performance. Vekrun never changes a production flag.' },
  'developer-services': { label: 'Developer services', description: 'Other services an agent can read from or act on, with your permission.' },
} as const;

export type IntegrationCategory = keyof typeof integrationCategories;

export const connectionMethods = {
  'api-key': 'Your API key',
  oauth: 'Sign in with the service',
  'local-runtime': 'Runs on your machine',
  'cli-account': 'Existing coding-agent account',
  mcp: 'MCP server',
  git: 'Your installed git',
  ssh: 'SSH',
  'openai-compatible': 'OpenAI-compatible endpoint',
  'built-in': 'Built in',
} as const;

export type ConnectionMethod = keyof typeof connectionMethods;
