/**
 * Single source of truth for positioning, navigation, packages and pricing.
 * Components import from here so every page states the same facts.
 */

export const site = {
  name: 'Vekrun',
  domain: 'vekrunapp.com',
  url: 'https://vekrunapp.com',
  /** Category line, used in titles, the footer and structured data. */
  tagline: 'The AI software engineering Factory.',
  headline: 'From prompt to verified outcome.',
  subheading: 'Describe what you want built. Vekrun plans the work, puts your coding agents on it and checks the result before it reaches you.',
  description:
    'Vekrun is a local-first AI software engineering Factory. Describe the outcome; it plans the work, coordinates your coding agents, builds and tests in isolated environments, verifies the result and hands you reviewable work with evidence.',
  licence: {
    model: 'Proprietary',
    summary: 'Vekrun is proprietary software. Vekrun Personal is free to use; Vekrun Teams is a paid, self-hosted licence.',
  },
  /**
   * Release facts. These must stay true: flip `downloadAvailable` only when a
   * signed installer is actually published.
   */
  release: {
    downloadAvailable: false,
    line: 'Vekrun isn’t available to download yet.',
  },
  contact: {
    securityEmail: null as string | null,
    generalEmail: null as string | null,
  },
} as const;

/**
 * Two packages. No Cloud plan, no Enterprise plan, no per-task fees.
 * Prices are planned launch pricing: there is no checkout, trial or billing yet.
 */
export const pricing = {
  currency: 'USD',
  label: 'Planned launch pricing',
  /** True only once a real checkout exists. Purchase controls render only then. */
  purchasable: false,
  notForSale: 'Planned launch pricing. Vekrun Teams isn’t on sale yet.',
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
  summary: 'The whole Factory on your own machine, for individual engineers.',
  includes: [
    'AI Factory across all your projects',
    'Council, Board and Inbox',
    'Isolated environments and Proof Packs',
    'Interactive Browser',
    'Engineering Memory and Insights',
    'Vekrun Mobile with your own Host',
  ],
  bring: 'Bring your own coding agents, model accounts, local models and compute.',
} as const;

export const teams = {
  name: 'Vekrun Teams',
  href: '/teams/',
  summary: 'One self-hosted Factory for your engineering organization.',
  includes: [
    'Everything in Personal, for every engineer',
    'Shared Coordinator on your servers',
    'Shared Board, Inbox and Factory queues',
    'SSO, roles and permissions',
    'Approvals, policies and audit',
    'Team-wide Memory and Insights',
  ],
  notIncluded: ['Model and API usage, billed by your providers', 'Your servers and workers'],
} as const;

export type NavItem = { label: string; href: string };

/** The five primary destinations. Confirmed; keep the order. */
export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/product/' },
  { label: 'Benefits', href: '/benefits/' },
  { label: 'Before & After', href: '/before-and-after/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Teams & Pricing', href: '/teams/' },
];

/** The header call to action points at the download page, which states availability plainly. */
export const primaryCta: NavItem = { label: 'Get Vekrun', href: '/download/' };

export const footerColumns: { title: string; items: NavItem[] }[] = [
  { title: 'Vekrun', items: primaryNav },
  {
    title: 'More',
    items: [
      { label: 'Download', href: '/download/' },
      { label: 'Security', href: '/security/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Licence', href: '/license/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** Sections of the Product page, used for its in-page index and for redirects. */
export const productSections: { id: string; label: string }[] = [
  { id: 'how', label: 'How it works' },
  { id: 'factory', label: 'AI Factory' },
  { id: 'council', label: 'Council' },
  { id: 'board', label: 'Board' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'verification', label: 'Verification' },
  { id: 'memory', label: 'Memory' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'tools', label: 'Your tools' },
];
