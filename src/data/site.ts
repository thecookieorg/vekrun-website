/**
 * Single source of truth for positioning, packages, pricing, navigation and status
 * vocabulary. Components never hardcode a product status string or a price; they
 * import from here so every route states the same facts.
 */

export const site = {
  name: 'Vekrun',
  domain: 'vekrunapp.com',
  url: 'https://vekrunapp.com',
  /** Category line, used in titles and the footer. */
  tagline: 'The AI software engineering Factory.',
  eyebrow: 'AI software engineering Factory',
  /** Homepage headline and subheading. */
  headline: 'Tell Vekrun what needs to ship.',
  subheading:
    'Your coding agents can write code. Vekrun coordinates everything around it: plan, implement, test, independently verify, review and deliver, across the projects you already own.',
  description:
    'Vekrun is an AI software engineering Factory. Give it an outcome, a feature, a ticket or a production incident, and it coordinates your coding agents to plan, build, test, verify and deliver the change in your real repositories while you stay in control. In development.',
  shortDescription: 'Give Vekrun the outcome. It coordinates your coding agents to plan, build, test, verify and deliver.',
  /** Licensing. Vekrun is proprietary; nothing has been publicly licensed or distributed. */
  licence: {
    model: 'Proprietary',
    summary: 'Vekrun is proprietary software. Vekrun Personal is free to use; Vekrun Teams is a paid, self-hosted licence.',
  },
  /** Public, verifiable project state. Update this when the status changes. */
  status: {
    label: 'In development',
    /** Last date the roadmap and availability data were reconciled with the desktop project. */
    asOf: '2026-10-28',
    /** One sentence, used once per page at most. */
    line: 'Vekrun is in development. There is no public download yet.',
    short: 'In development · No public release yet',
    /** What the "verified in development" status means. Used in legends only. */
    meaning: 'Verified in development means the capability works in the current development build, with automated tests, on macOS. It is not in any public release. Windows and Linux are not yet verified by hand.',
  },
  /** The desktop application repository is private and stays private. */
  repo: { public: false },
  contact: {
    securityEmail: null as string | null,
    generalEmail: null as string | null,
  },
} as const;

/**
 * The two packages. There is no Cloud plan and no Enterprise plan.
 * Prices are planned launch pricing: there is no checkout, trial or billing.
 */
export const pricing = {
  currency: 'USD',
  label: 'Planned launch pricing',
  /** True only once a real checkout exists. Purchase controls render only then. */
  purchasable: false,
  notForSale: 'Planned launch pricing. Vekrun Teams is not available to buy yet.',
  teams: { base: 199, includedEngineers: 10, perAdditionalEngineer: 10, calculatorMax: 500 },
} as const;

/** Monthly Vekrun Teams price in USD: 199 + 10 × max(0, engineers − 10). */
export function teamsMonthly(engineers: number): number {
  const n = Math.max(1, Math.floor(engineers));
  return pricing.teams.base + pricing.teams.perAdditionalEngineer * Math.max(0, n - pricing.teams.includedEngineers);
}

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export const personal = {
  name: 'Vekrun Personal',
  price: 'Free',
  priceNote: 'Free to use when released',
  summary: 'The native desktop Factory for individual engineers, on your own machine.',
  includes: [
    'AI Factory with multiple projects and jobs',
    'Board for your repositories, trackers and monitoring',
    'Inbox for the decisions that need you',
    'Isolated environments',
    'Verification and Proof Packs',
    'Personal Engineering Memory and Insights',
    'Connections to your coding CLIs, models and tools',
    'Mobile pairing with your own Host',
  ],
  bring: 'You bring your coding CLI logins, model or API accounts, local models, Git access and compute. Vekrun does not bundle paid inference.',
} as const;

export const teams = {
  name: 'Vekrun Teams',
  href: '/teams/',
  summary: 'One self-hosted Coordinator for your organization: shared Board, Factory queues, approvals, memory and reporting, running on your infrastructure.',
  includes: [
    'Self-hosted shared Coordinator and organization data store',
    'SSO, organization roles and permissions',
    'Shared Board, incident intake and workflow orchestration',
    'Shared Factory queues on customer-owned workers',
    'Team-wide Engineering Memory and Insights',
    'Approvals, policies and audit',
    'Secure integrations and secure mobile access',
    'Updates, licence and support from Vekrun',
  ],
  notIncluded: [
    'Model and API usage, billed by your providers',
    'Your servers, workers and other infrastructure',
  ],
} as const;

export type NavItem = { label: string; href: string; description?: string };

/** The Product menu. Order is the order these appear everywhere. */
export const productPages: (NavItem & { key: string })[] = [
  { key: 'factory', label: 'AI Factory', href: '/features/factory/', description: 'Assign an outcome. Watch it planned, built, tested and verified.' },
  { key: 'board', label: 'Board', href: '/features/board/', description: 'Tickets, pull requests and production incidents as one stream of work.' },
  { key: 'inbox', label: 'Inbox', href: '/features/inbox/', description: 'Only the decisions that need a person: approvals, questions, reviews.' },
  { key: 'verification', label: 'Verification', href: '/features/verification/', description: 'Isolated environments, executable checks and inspectable Proof Packs.' },
  { key: 'memory', label: 'Engineering Memory', href: '/features/engineering-memory/', description: 'A searchable record of every decision, change and result.' },
  { key: 'insights', label: 'Insights', href: '/features/engineering-memory/#insights', description: 'Delivery reporting from verifiable work, not lines of code.' },
  { key: 'connections', label: 'Connections', href: '/integrations/#connections', description: 'Coding CLIs, models, trackers and monitoring, set up and kept current.' },
  { key: 'mobile', label: 'Mobile and Host', href: '/features/mobile/', description: 'Your Factory from your phone, with a Host that stays reachable.' },
];

/** Secondary tools for troubleshooting and takeover. Never the headline. */
export const advancedPages: NavItem[] = [
  { label: 'Terminal and SSH', href: '/features/terminal/', description: 'Take over a job by hand, on your machine or a remote one.' },
  { label: 'Coding sessions', href: '/features/ai-coding/', description: 'Work directly with a model, change by change.' },
  { label: 'Code review', href: '/features/code-review/', description: 'Pull requests, findings and your feedback.' },
];

export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/features/' },
  { label: 'How it works', href: '/how-it-works/' },
  { label: 'Teams & Pricing', href: '/teams/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Roadmap', href: '/roadmap/' },
];

export const primaryCta = {
  label: 'Explore AI Factory',
  href: '/features/factory/',
  releasedLabel: 'Download Vekrun, free',
  releasedHref: '/download/',
};

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      ...productPages.filter((p) => !p.href.includes('#')).map(({ label, href }) => ({ label, href })),
      { label: 'All capabilities', href: '/features/' },
    ],
  },
  {
    title: 'Vekrun',
    items: [
      { label: 'How it works', href: '/how-it-works/' },
      { label: 'Teams & Pricing', href: '/teams/' },
      { label: 'Integrations', href: '/integrations/' },
      { label: 'Download', href: '/download/' },
      { label: 'Roadmap', href: '/roadmap/' },
      { label: 'Documentation', href: '/docs/' },
    ],
  },
  {
    title: 'Advanced',
    items: advancedPages.map(({ label, href }) => ({ label, href })),
  },
  {
    title: 'Trust',
    items: [
      { label: 'Security', href: '/security/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Licence', href: '/license/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/**
 * One status vocabulary for the site and the docs: product vision, in development,
 * verified development build, publicly available. Keep the strings here.
 */
export const availability = {
  available: {
    label: 'Verified in development',
    description: 'Works in the development build with automated tests on macOS. Not in a public release.',
    tone: 'ok',
  },
  'in-development': {
    label: 'In development',
    description: 'Implementation exists or is under way, but the full workflow or its verification is outstanding.',
    tone: 'warn',
  },
  planned: {
    label: 'Planned',
    description: 'Approved product direction with no complete implementation yet.',
    tone: 'muted',
  },
  proposed: {
    label: 'Exploring',
    description: 'Under consideration. Not approved or scheduled.',
    tone: 'faint',
  },
} as const;

export type Availability = keyof typeof availability;

/** Roadmap uses the same statuses plus "released" for public builds. */
export const roadmapStatuses = {
  implemented: availability.available,
  'in-progress': availability['in-development'],
  planned: availability.planned,
  proposed: availability.proposed,
  released: { label: 'Available', description: 'Available in a signed public Vekrun release.', tone: 'info' },
} as const;

export type RoadmapStatus = keyof typeof roadmapStatuses;

/** Roadmap areas, in display order, by user experience. */
export const roadmapAreas = {
  factory: 'AI Factory',
  environments: 'Projects and isolated environments',
  agents: 'Coding agents and models',
  board: 'Board, trackers and incidents',
  inbox: 'Inbox and approvals',
  verification: 'Verification and Proof Packs',
  memory: 'Engineering Memory and Insights',
  'host-mobile': 'Host and Mobile',
  teams: 'Vekrun Teams',
  delivery: 'CI, delivery and security',
  advanced: 'Advanced workspace',
  releases: 'Releases',
} as const;

export type RoadmapArea = keyof typeof roadmapAreas;

/** Integration categories. */
export const integrationCategories = {
  'coding-clis': { label: 'Coding CLIs and Git tools', description: 'The coding agents and command-line tools you already use, discovered, installed where supported, and kept current on your Host.' },
  models: { label: 'Models and API gateways', description: 'Hosted model APIs and gateways you connect with your own account, billed by the provider.' },
  'source-control': { label: 'Source control', description: 'Repositories, branches, pull requests and reviews.' },
  'project-management': { label: 'Project management', description: 'Where your tickets live. Connect one and its work appears on the Board.' },
  monitoring: { label: 'Monitoring', description: 'Error tracking and observability. Production problems become shared Work Items you can investigate and fix.' },
  'ci-delivery': { label: 'CI and delivery', description: 'Pipelines, test runs, deployments, scanners and feature flags: what happened after a change, linked to the work.' },
  'local-runtimes': { label: 'Local runtimes', description: 'Models that run on your own hardware.' },
  services: { label: 'Workers and other services', description: 'Machines, MCP servers and services an agent can use with your permission.' },
} as const;

export type IntegrationCategory = keyof typeof integrationCategories;

export const connectionMethods = {
  'api-key': 'Your API key',
  oauth: 'Sign in with the service',
  'local-runtime': 'Runs on your machine',
  'cli-account': 'Your signed-in CLI on the Host',
  mcp: 'MCP server',
  git: 'Your installed git',
  ssh: 'SSH',
  'openai-compatible': 'OpenAI-compatible endpoint',
  'built-in': 'Built in',
} as const;

export type ConnectionMethod = keyof typeof connectionMethods;
