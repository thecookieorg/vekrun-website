/**
 * Single source of truth for positioning, navigation, packages and pricing.
 * Components import from here so every page states the same facts.
 */

export const site = {
  name: 'Vekrun',
  domain: 'vekrunapp.com',
  url: 'https://vekrunapp.com',
  /** Category line, used in titles, the footer and structured data. */
  tagline: 'Your AI engineering team. On your machine.',
  headline: 'Your AI engineering team. On your machine.',
  subheadline: 'From idea to verified software.',
  subheading: 'Describe what you want built. Vekrun plans the work, coordinates AI models, writes and tests code in isolated environments, and delivers results you can verify.',
  description:
    'Vekrun is a local-first AI software engineering platform. Describe an outcome; Vekrun plans the work, coordinates the models you choose, builds and tests in isolated environments and delivers pull requests with the evidence attached. No coding-agent subscription required.',
  /** Short trust signals under the homepage hero. Each one must stay true. */
  trust: ['Local-first', 'Download local AI models', 'Model-independent', 'Works with your stack', 'Free for individuals'],
  licence: {
    model: 'Proprietary',
    summary: 'Vekrun is proprietary software. Vekrun Free costs nothing for individual developers. Vekrun Teams, a self-hosted plan for engineering teams, is coming soon.',
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
    generalEmail: 'support@vekrunapp.com' as string | null,
  },
  /**
   * Early access and Teams interest go to a real inbox by email: plain
   * mailto links, no forms and no third-party form service.
   */
  earlyAccess: {
    email: 'support@vekrunapp.com',
  },
} as const;

const mailto = (subject: string, body?: string) =>
  `mailto:${site.earlyAccess.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

/** The early access email: subject only, the visitor writes the rest. */
export const earlyAccessMailto = mailto('Vekrun early access');

/**
 * The Teams interest email. Every field is optional except the address the
 * visitor sends from; replying "unsubscribe" removes them.
 */
export const teamsInterestMailto = mailto(
  'Vekrun Teams interest',
  [
    'I’m interested in Vekrun Teams. Email me about Teams availability. I can unsubscribe by replying "unsubscribe".',
    '',
    'Number of engineers:',
    'Where we would run Teams (our own servers, private cloud, other):',
    'What we want Teams for most:',
  ].join('\n'),
);

export type Plan = {
  key: 'free' | 'teams';
  name: string;
  price: string;
  priceNote: string;
  /** A short qualifier under the price. */
  priceAlt?: string;
  audience: string;
  summary: string;
  /** Planned plans say so on the card. Free is the product as it exists. */
  planned: boolean;
  status?: string;
  /** A short line above the features, such as "Everything in Free, plus". */
  lead?: string;
  features: string[];
  /** Capabilities on the way to this plan, shown under their own Planned label. */
  upcoming?: string[];
  cta: { label: string; href: string };
  /** An optional second link, such as the plan's own page. */
  more?: { label: string; href: string };
};

/**
 * Teams pricing. Flat monthly price for up to `included` engineers, then a
 * fixed amount per engineer beyond that. No usage fees of any kind: customers
 * run and pay for their own infrastructure and model usage.
 */
export const teamsPricing = { base: 199, included: 10, perExtra: 10, currency: 'USD' } as const;

/** Monthly Teams price in USD for a team of `engineers` (at least 1). */
export const teamsMonthly = (engineers: number): number => {
  const n = Math.max(1, Math.floor(engineers));
  return teamsPricing.base + Math.max(0, n - teamsPricing.included) * teamsPricing.perExtra;
};

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

/**
 * Two plans. Free is the individual engineering platform, as it exists today.
 * Teams adds shared coordination on infrastructure the customer controls; it
 * is planned, with a fixed price, and there is no checkout.
 */
export const plans: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    priceNote: 'forever',
    audience: 'For individual engineers',
    summary: 'Your own AI engineering team. Free on your machine, with the full local-first engineering experience.',
    planned: false,
    features: [
      'AI Factory and Coordinator',
      'Multi-model Council',
      'Competitive Engineering',
      'Work Items and Git workflows',
      'Personal Engineering Memory',
      'Architecture Explorer and Time Machine',
      'Change Impact Intelligence',
      'Proof Packs and engineering verification',
      'Workflow Templates and PR automation',
      'Live Share',
      'Local and external model connections',
      'CLI and MCP',
    ],
    upcoming: [
      'Work Anywhere: run the Factory on your own VPS',
      'Secure server setup and headless workers',
      'Remote engineering previews',
    ],
    cta: { label: 'Request early access', href: '/download/' },
  },
  {
    key: 'teams',
    name: 'Teams',
    price: usd(teamsPricing.base),
    priceNote: `per month, includes ${teamsPricing.included} engineers`,
    priceAlt: `USD. ${usd(teamsPricing.perExtra)} per month for each additional engineer.`,
    audience: 'For engineering teams',
    summary: 'Shared Engineering Memory for the whole team, with SSO, coordination and governance, self-hosted on infrastructure you control.',
    planned: true,
    lead: 'Everything in Free, plus:',
    features: [
      'Shared Engineering Memory across engineers and repositories',
      'SSO and role-based access control',
      'Team-wide coordination and Work Items',
      'Organization policies and approvals',
      'Coordinator and shared worker pools on your servers',
      'Organization policies for worker access',
      'Shared Architecture Intelligence',
      'Collaboration across engineers’ installations',
      'PR intelligence and engineering insights for delivery and verification',
      'Works with your Git and engineering workflows',
    ],
    cta: { label: 'Register Teams interest', href: teamsInterestMailto },
    more: { label: 'Explore Vekrun Teams', href: '/teams/' },
  },
];

export const planByKey = (k: Plan['key']) => plans.find((p) => p.key === k)!;

export type NavItem = { label: string; href: string };

/** The primary destinations. "Get Vekrun" is the header's call to action. */
export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/product/' },
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Teams', href: '/teams/' },
  { label: 'Pricing', href: '/pricing/' },
];

/** The header call to action: the Get Vekrun page, with early access first. */
export const primaryCta: NavItem = { label: 'Get Vekrun', href: '/download/' };

/**
 * The two conversion paths, used wherever a page ends. Early access is a real
 * email to the team (see `site.earlyAccess`); there is no public download yet.
 */
export const personalCta: NavItem = { label: 'Request early access', href: '/download/' };
export const pricingCta: NavItem = { label: 'See pricing', href: '/pricing/' };

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: 'Vekrun',
    items: [
      ...primaryNav,
      { label: 'Before & After', href: '/before-and-after/' },
      { label: 'Integrations', href: '/integrations/' },
      { label: 'Get Vekrun', href: '/download/' },
    ],
  },
  {
    title: 'More',
    items: [
      { label: 'Security', href: '/security/' },
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Licence', href: '/license/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** Sections of the Product page, used for its in-page index and for redirects. */
export const productSections: { id: string; label: string }[] = [
  { id: 'models', label: 'Models' },
  { id: 'council', label: 'Council' },
  { id: 'competitive', label: 'Competitive Engineering' },
  { id: 'memory', label: 'Memory and architecture' },
  { id: 'live-share', label: 'Live Share' },
  { id: 'browser', label: 'Browser' },
  { id: 'proof', label: 'Proof Packs' },
  { id: 'production', label: 'Production errors' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'work-anywhere', label: 'Work Anywhere' },
  { id: 'environments', label: 'Environments' },
  { id: 'voice', label: 'Voice' },
  { id: 'apps', label: 'Apps' },
  { id: 'stack', label: 'Stack' },
  { id: 'mobile', label: 'On your phone' },
  { id: 'tools', label: 'Tools' },
  { id: 'next', label: 'What’s next' },
];
/** Anchors inside Product sections that old URLs may also point at. */
export const productSubAnchors = ['architecture', 'board', 'experiments', 'improvement-lab', 'high-assurance', 'guardian', 'templates'];

/** Sections of How It Works: the six stages, in order. */
export const howSections: { id: string; label: string }[] = [
  { id: 'describe', label: 'Describe' },
  { id: 'council', label: 'Plan and compare' },
  { id: 'factory', label: 'Build' },
  { id: 'verification', label: 'Verify' },
  { id: 'git', label: 'Deliver' },
  { id: 'remember', label: 'Remember' },
];
