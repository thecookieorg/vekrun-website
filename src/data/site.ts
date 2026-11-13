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
  trust: ['Local-first', 'Model-independent', 'Works with your stack', 'Free for individuals'],
  licence: {
    model: 'Proprietary',
    summary: 'Vekrun is proprietary software. Vekrun Free costs nothing for individual developers. Cloud and Enterprise are planned.',
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
   * Early access and the Cloud wishlist go to a real inbox by email: plain
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
 * The Cloud wishlist email. Every field is optional except the address the
 * visitor sends from; replying "unsubscribe" removes them.
 */
export const cloudWishlistMailto = mailto(
  'Vekrun Cloud wishlist',
  [
    'Add me to the Vekrun Cloud wishlist and email me about Vekrun Cloud. I can unsubscribe by replying "unsubscribe".',
    '',
    'Intended use (Individual / Team / Enterprise):',
    'The Cloud capability I want most:',
  ].join('\n'),
);

export const enterpriseMailto = mailto('Vekrun Enterprise interest');

export type Plan = {
  key: 'free' | 'cloud' | 'enterprise';
  name: string;
  price: string;
  priceNote: string;
  audience: string;
  summary: string;
  /** Planned plans say so on the card. Free is the product as it exists. */
  planned: boolean;
  status?: string;
  features: string[];
  cta: { label: string; href: string };
};

/**
 * Three plans. Free is the product. Cloud and Enterprise are planned: no
 * prices, no checkout, no hosted infrastructure. Custom model connections
 * are in every plan; Enterprise differs by infrastructure and governance.
 */
export const plans: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    priceNote: 'forever',
    audience: 'For individual developers',
    summary: 'The whole engineering workflow on your own machine, with the models you choose.',
    planned: false,
    features: [
      'Local-first engineering workspace',
      'Vekrun’s native agent, with your own model connections',
      'Council and Factory',
      'Work Items and Git workflows',
      'Engineering Memory',
      'Proof Packs',
      'Live Share',
      'Bring your own models and local compute',
    ],
    cta: { label: 'Request early access', href: '/download/' },
  },
  {
    key: 'cloud',
    name: 'Cloud',
    price: 'Pricing TBD',
    priceNote: '',
    audience: 'For individuals and teams who want Vekrun anywhere',
    summary: 'Hosted workspaces and Factory execution, so work continues when your laptop doesn’t.',
    planned: true,
    status: 'Coming soon',
    features: [
      'Engineering workspace in the browser',
      'Continue anywhere, on any device',
      'Persistent cloud workspaces',
      'Cloud Factory execution',
      'Shared engineering state',
      'Team collaboration',
      'Managed infrastructure',
    ],
    cta: { label: 'Join the wishlist', href: '/pricing/#cloud-wishlist' },
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    priceNote: '',
    audience: 'For organizations with infrastructure and compliance requirements',
    summary: 'Vekrun on your infrastructure, under your policies.',
    planned: true,
    status: 'Planned',
    features: [
      'Self-hosted or private deployment',
      'Private model infrastructure',
      'Organization-wide Engineering Memory',
      'SSO and access controls',
      'Audit and policy governance',
      'Private execution workers',
      'Deployment and support options',
    ],
    cta: { label: 'Register interest', href: enterpriseMailto },
  },
];

export const planByKey = (k: Plan['key']) => plans.find((p) => p.key === k)!;

export type NavItem = { label: string; href: string };

/** The primary destinations. "Get Vekrun" is the header's call to action. */
export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/product/' },
  { label: 'How It Works', href: '/how-it-works/' },
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
  { id: 'memory', label: 'Engineering Memory' },
  { id: 'live-share', label: 'Live Share' },
  { id: 'stack', label: 'Your stack' },
  { id: 'board', label: 'Board' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'tools', label: 'Your tools' },
];

/** Sections of How It Works: the five stages, in order. */
export const howSections: { id: string; label: string }[] = [
  { id: 'describe', label: 'Describe' },
  { id: 'council', label: 'Plan' },
  { id: 'factory', label: 'Build' },
  { id: 'verification', label: 'Verify' },
  { id: 'git', label: 'Review' },
];
