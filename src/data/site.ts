/**
 * Single source of truth for product metadata, navigation and availability.
 * Components never hardcode a product status string; they import from here.
 */

export const site = {
  name: 'Vekrun',
  domain: 'vekrunapp.com',
  url: 'https://vekrunapp.com',
  tagline: 'Your terminal. Your models. Your rules.',
  headline: 'The developer workspace that puts you in control.',
  description:
    'Vekrun is an open-source developer workspace combining a modern terminal, AI coding agents and autonomous engineering teams. Bring your own models, connect your tools, and build without vendor lock-in.',
  shortDescription:
    'Open-source terminal, AI coding agents and autonomous engineering teams. Bring your own models.',
  license: {
    name: 'Apache License 2.0',
    spdx: 'Apache-2.0',
    /** The desktop project proposes Apache 2.0 subject to final review. */
    status: 'proposed, subject to final review',
  },
  /** Public, verifiable project state. Update this when the status changes. */
  status: {
    label: 'In development',
    phase: 'Pre-release',
    /** Last date the roadmap and availability data were reconciled with the desktop project. */
    asOf: '2026-10-19',
    summary:
      'Vekrun is being built in the open against a twelve-milestone plan. There are no public releases yet. Everything on this site that is marked available is implemented in the current source and exercised by tests on macOS; Windows and Linux are not yet verified by hand.',
  },
  repo: {
    org: 'thecookieorg',
    name: 'vekrun',
    /** Flip to true once the desktop repository is public. Links render only when true. */
    public: false,
    url: 'https://github.com/thecookieorg/vekrun',
  },
  websiteRepo: {
    name: 'vekrun-website',
    public: true,
    url: 'https://github.com/thecookieorg/vekrun-website',
  },
  /** Channels that exist today. Null means "not yet published"; pages say so instead of linking. */
  contact: {
    securityEmail: null as string | null,
    generalEmail: null as string | null,
    discussionsUrl: null as string | null,
  },
  social: {
    /** Add handles here when accounts exist. Nothing is linked until then. */
    github: null as string | null,
  },
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/#product' },
  { label: 'Features', href: '/features/' },
  { label: 'Factory', href: '/factory/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Roadmap', href: '/roadmap/' },
];

export const primaryCta = {
  label: 'Explore Vekrun',
  href: '/#product',
  /** Becomes "Download Vekrun" → /download/ once a release exists (see releases data). */
  releasedLabel: 'Download Vekrun',
  releasedHref: '/download/',
};

export const featurePages: (NavItem & { key: string })[] = [
  { key: 'terminal', label: 'Terminal', href: '/features/terminal/', description: 'A full-featured desktop terminal for everyday development.' },
  { key: 'ai-coding', label: 'AI coding', href: '/features/ai-coding/', description: 'Provider-agnostic coding agents with Ask, Plan, Build, Debug and Review modes.' },
  { key: 'factory', label: 'Factory', href: '/factory/', description: 'Coordinated agent teams with independent verification.' },
  { key: 'planning', label: 'Planning and Council', href: '/features/planning/', description: 'Structured plans and multi-model deliberation before work starts.' },
  { key: 'board', label: 'Board', href: '/features/board/', description: 'Your assigned tickets, connected to execution.' },
  { key: 'code-review', label: 'Code review', href: '/features/code-review/', description: 'A review inbox with a native AI review engine.' },
  { key: 'agent-platform', label: 'Agent platform', href: '/features/agent-platform/', description: 'Control plane, workers, durable tasks and agent APIs you can self-host.' },
];

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      { label: 'Terminal', href: '/features/terminal/' },
      { label: 'AI coding', href: '/features/ai-coding/' },
      { label: 'Factory', href: '/factory/' },
      { label: 'Planning and Council', href: '/features/planning/' },
      { label: 'Board', href: '/features/board/' },
      { label: 'Code review', href: '/features/code-review/' },
      { label: 'Agent platform', href: '/features/agent-platform/' },
      { label: 'Integrations', href: '/integrations/' },
    ],
  },
  {
    title: 'Project',
    items: [
      { label: 'Documentation', href: '/docs/' },
      { label: 'Roadmap', href: '/roadmap/' },
      { label: 'Releases', href: '/download/' },
      { label: 'Open source', href: '/open-source/' },
      { label: 'Contributing', href: '/docs/contributing/contribution-process/' },
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
 * Availability vocabulary shared by features, integrations and the roadmap.
 * Keep the strings here; never duplicate them in components.
 */
export const availability = {
  available: {
    label: 'Available',
    description: 'Implemented in the current source and exercised by tests on macOS. No public build yet.',
    tone: 'ok',
  },
  'in-development': {
    label: 'In development',
    description: 'Actively being built. Parts exist on the main branch, the feature is not complete.',
    tone: 'warn',
  },
  planned: {
    label: 'Planned',
    description: 'On the roadmap with a milestone. Not started.',
    tone: 'muted',
  },
  'requires-configuration': {
    label: 'Requires configuration',
    description: 'Works once you supply your own credentials, endpoint or registered app.',
    tone: 'info',
  },
} as const;

export type Availability = keyof typeof availability;

export const roadmapStatuses = {
  planned: { label: 'Planned', tone: 'muted' },
  'in-progress': { label: 'In progress', tone: 'warn' },
  implemented: { label: 'Implemented', tone: 'ok' },
  released: { label: 'Released', tone: 'info' },
} as const;

export type RoadmapStatus = keyof typeof roadmapStatuses;

export const integrationCategories = {
  'ai-providers': { label: 'AI providers', description: 'Hosted model APIs you connect with your own key.' },
  'coding-agents': { label: 'Coding agents', description: 'Optional compatibility with coding-agent accounts you already pay for.' },
  'local-models': { label: 'Local models', description: 'Runtimes that serve models on your own hardware.' },
  'project-management': { label: 'Project management', description: 'Ticket sources for the Board.' },
  'source-control': { label: 'Source control', description: 'Git hosting, pull requests and remotes.' },
  'developer-tools': { label: 'Developer tools', description: 'Everything else the workspace talks to.' },
  'mcp-servers': { label: 'MCP servers', description: 'Model Context Protocol servers Vekrun can connect to as a client.' },
} as const;

export type IntegrationCategory = keyof typeof integrationCategories;

export const connectionMethods = {
  'api-key': 'API key',
  'oauth': 'OAuth',
  'local-runtime': 'Local runtime',
  'cli-account': 'Coding-agent account',
  'mcp-remote': 'MCP, remote (Streamable HTTP)',
  'mcp-stdio': 'MCP, local (stdio)',
  'git': 'Your installed git',
  'ssh': 'SSH',
  'openai-compatible': 'OpenAI-compatible endpoint',
  'built-in': 'Built in',
} as const;

export type ConnectionMethod = keyof typeof connectionMethods;
