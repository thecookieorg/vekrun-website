/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { footerColumns, primaryNav, primaryCta, personalCta, pricingCta, productSections, productSubAnchors, howSections, site, plans, teamsPricing, teamsMonthly, teamsDeployments, teamsInterestMailto, earlyAccessMailto } from '@/data/site';
import { comparisons, projectExamples } from '@/data/capabilities';
import { toolGroups, platforms, allTools, stackRows, toolById, modelIds, agentIds, hostingProviders } from '@/data/integrations';
import { redirects } from '../../astro.config.mjs';

const pagesDir = new URL('../../src/pages/', import.meta.url);
const pageExists = (route: string) => {
  const p = route.replace(/#.*$/, '').replace(/^\/|\/$/g, '');
  return p === '' ? existsSync(new URL('index.astro', pagesDir)) : existsSync(new URL(`${p}.astro`, pagesDir)) || existsSync(new URL(`${p}/index.astro`, pagesDir));
};

describe('plans and pricing', () => {
  it('has exactly two plans: Free and Teams, in that order', () => {
    expect(plans.map((p) => p.name)).toEqual(['Free', 'Teams']);
  });
  it('makes Free $0 forever for individuals and Teams a planned team plan', () => {
    const [free, teams] = plans;
    expect(free).toMatchObject({ price: '$0', priceNote: 'forever', planned: false, audience: 'For individual engineers' });
    expect(teams).toMatchObject({ price: '$199', priceNote: 'per month, includes 5 developers', planned: true });
    expect(JSON.stringify(plans)).not.toMatch(/Planned/);
    expect(teams!.priceAlt).toBe('USD. $29 per month for each additional developer.');
  });
  it('keeps the full individual engineering platform in Free', () => {
    const f = plans[0]!.features.join(' ');
    for (const k of ['Factory', 'Coordinator', 'Council', 'Competitive Engineering', 'Work Items', 'Git', 'Engineering Memory', 'Architecture Explorer', 'Time Machine', 'Change Impact Intelligence', 'Proof Packs', 'Workflow Templates', 'Live Share', 'CLI', 'MCP']) expect(f).toContain(k);
  });
  it('leads Teams with connected Factories, includes SSO and both deployment options', () => {
    const teams = plans[1]!;
    expect(teams.features[0]).toBe('Connected AI Factories across every developer');
    expect(teams.lead).toBe('Everything in Free, plus:');
    const t = [teams.summary, ...teams.features].join(' ');
    expect(teams.summary).toMatch(/^Your engineering organization, working as one\./);
    for (const k of ['coordination', 'handoffs', 'dependencies', 'Proof Packs', 'safeguards', 'Shared Engineering Memory', 'organizational intelligence', 'SSO', 'role-based access', 'Connected Desktops', 'Dedicated Coordinator', 'worker pools', 'Git']) expect(t).toContain(k);
    expect(teams.more).toEqual({ label: 'Explore Vekrun Teams', href: '/teams/' });
  });
  it('includes Work Anywhere in Free today, at no Vekrun cost, and lists nothing as coming', () => {
    expect(plans[0]!.features.join(' ')).toMatch(/Work Anywhere: run the Factory on your own VPS/);
    for (const p of plans) expect([p.summary, p.audience, p.priceNote, p.lead ?? '', ...p.features].join(' '), p.name).not.toMatch(/coming|planned/i);
    expect(JSON.stringify(plans[0])).not.toMatch(/per minute|per worker|limit/i);
  });
  it('prices Teams at $199 including 5 developers and $29 for each additional developer', () => {
    expect(teamsPricing).toEqual({ base: 199, included: 5, perExtra: 29, currency: 'USD' });
    for (const [n, price] of [[1, 199], [3, 199], [5, 199], [6, 228], [7, 257], [10, 344], [20, 634], [50, 1504]] as const) expect(teamsMonthly(n), `${n} developers`).toBe(price);
  });
  it('never charges for fewer than one developer or fractional developers', () => {
    expect(teamsMonthly(0)).toBe(199);
    expect(teamsMonthly(5.9)).toBe(199);
  });
  it('includes both deployment options in one Teams subscription', () => {
    expect(teamsDeployments.map((d) => d.name)).toEqual(['Connected Desktops', 'Dedicated Coordinator']);
    expect(teamsDeployments[0]!.line).toMatch(/No server required.*peer network/);
    expect(teamsDeployments[1]!.line).toMatch(/Rust and PostgreSQL.*persistent synchronization, centralized governance and always-on availability/);
  });
  it('publishes no Cloud or Enterprise tier, usage fees or purchase paths', () => {
    const all = JSON.stringify(plans);
    expect(all).not.toMatch(/\bCloud\b|Enterprise|\$99|per developer|per seat|checkout|buy now|free trial|discount|unlimited|per task|per agent/i);
    for (const p of plans) expect(p.cta.label).not.toMatch(/buy|purchase|subscribe/i);
  });
  it('gives each plan a working call to action', () => {
    expect(plans.map((p) => p.cta.label)).toEqual(['Request early access', 'Register Teams interest']);
    expect(plans[0]!.cta.href).toBe('/download/');
    expect(plans[1]!.cta.href).toBe(teamsInterestMailto);
  });
});

describe('email paths', () => {
  it('sends early access and Teams interest to the support inbox', () => {
    expect(site.earlyAccess.email).toBe('support@vekrunapp.com');
    expect(earlyAccessMailto).toBe('mailto:support@vekrunapp.com?subject=Vekrun%20early%20access');
    expect(teamsInterestMailto).toMatch(/^mailto:support@vekrunapp\.com\?subject=Vekrun%20Teams%20interest&body=/);
  });
  it('asks for consent, explains how to unsubscribe and asks about the team', () => {
    const body = decodeURIComponent(teamsInterestMailto.split('body=')[1]!);
    expect(body).toMatch(/Email me about Teams availability/);
    expect(body).toMatch(/unsubscribe/);
    expect(body).toMatch(/Number of developers:/);
    expect(body).toMatch(/Connected Desktops, Dedicated Coordinator/);
  });
});

describe('availability', () => {
  it('offers early access instead of a public installer, without coming-soon wording', () => {
    expect(site.release.downloadAvailable).toBe(false);
    expect(site.release.line).toBe('Vekrun is in early access on macOS.');
    expect(JSON.stringify(site)).not.toMatch(/coming|\byet\b|not available/i);
  });
});

describe('navigation', () => {
  it('has Product, Teams, Pricing and Integrations, with Get Vekrun as the call to action', () => {
    expect(primaryNav.map((n) => n.label)).toEqual(['Product', 'Teams', 'Pricing', 'Integrations']);
    expect(primaryCta).toEqual({ label: 'Get Vekrun', href: '/download/' });
  });
  it('keeps Docs and Roadmap out of every navigation', () => {
    const all = [...primaryNav, primaryCta, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      expect(n.label, n.href).not.toMatch(/docs|documentation|roadmap|benefits|cloud|enterprise/i);
      expect(n.href, n.label).not.toMatch(/^\/(docs|roadmap|features|cloud|benefits|ai-teams|open-source)\//);
    }
  });
  it('links only to pages that exist, with trailing slashes', () => {
    for (const n of [...primaryNav, primaryCta, personalCta, pricingCta, ...footerColumns.flatMap((c) => c.items)]) {
      expect(n.href, n.label).toMatch(/^\/(.*\/)?$/);
      expect(pageExists(n.href), n.href).toBe(true);
    }
  });
  it('keeps How It Works and Before & After reachable from the footer, with every other page', () => {
    expect(footerColumns.flatMap((c) => c.items).map((n) => n.label)).toEqual(expect.arrayContaining(['Product', 'How It Works', 'Before & After', 'Teams', 'Pricing', 'Integrations', 'Get Vekrun', 'Security', 'Privacy', 'Licence', 'Contact']));
  });
});

describe('redirects', () => {
  const entries = Object.entries(redirects) as [string, string][];
  it('retires docs, roadmap, the feature pages, Benefits and the old Cloud page', () => {
    for (const r of ['/docs/', '/roadmap/', '/features/', '/features/factory/', '/benefits/', '/cloud/']) expect(redirects, r).toHaveProperty([r]);
    for (const r of ['/docs/', '/roadmap/', '/benefits/', '/cloud/']) expect(pageExists(r), r).toBe(false);
    expect(redirects['/cloud/']).toBe('/teams/');
    expect(redirects['/benefits/']).toBe('/before-and-after/');
  });
  it('serves How It Works, Teams, Before & After and Pricing as real pages', () => {
    for (const r of ['/how-it-works/', '/teams/', '/before-and-after/', '/pricing/']) {
      expect(redirects, r).not.toHaveProperty([r]);
      expect(pageExists(r), r).toBe(true);
    }
  });
  it('sends every old URL straight to a live page and a real section, never through another redirect', () => {
    const anchors: Record<string, Set<string>> = {
      '/product/': new Set([...productSections.map((s) => s.id), ...productSubAnchors]),
      '/how-it-works/': new Set([...howSections.map((s) => s.id), 'inbox', 'compare']),
    };
    for (const [from, to] of entries) {
      const path = to.replace(/#.*$/, '');
      expect(path in redirects, `${from} -> ${to}`).toBe(false);
      expect(pageExists(path), `${from} -> ${to}`).toBe(true);
      if (anchors[path] && to.includes('#')) expect(anchors[path]!.has(to.split('#')[1]!), `${from} -> ${to}`).toBe(true);
    }
  });
});

describe('integrations', () => {
  it('has unique ids and puts model providers first, then optional coding agents', () => {
    const ids = allTools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(toolGroups.map((g) => g.key)).toEqual(['models', 'agents', 'pm', 'git', 'monitoring', 'context']);
    expect(toolGroups[0]!.title).toBe('Model providers');
    expect(toolGroups[0]!.line).toMatch(/Vekrun’s own agent/);
    expect(toolGroups[0]!.tools.map((t) => t.tag)).toEqual(['Gateway', 'Direct', 'Local', 'Local']);
    expect(toolGroups[1]!.title).toMatch(/Optional/);
    expect(toolGroups[1]!.line).toMatch(/None of them is required/);
  });
  it('lists the shipped models and coding CLIs, and nothing that only connects through MCP', () => {
    expect(toolGroups[0]!.tools.map((t) => t.id)).toEqual(['openrouter', 'xai', 'ollama', 'lm-studio']);
    expect(toolGroups[1]!.tools.map((t) => t.id)).toEqual(['claude-code', 'codex', 'antigravity', 'grok-build']);
    const ids = allTools.map((t) => t.id);
    for (const gone of ['gemini-cli', 'kamal', 'docker', 'vercel', 'cloudflare', 'supabase', 'stripe', 'postgres', 'pagerduty', 'llama-cpp']) expect(ids, gone).not.toContain(gone);
    expect(ids).toContain('obsidian');
  });
  it('keeps Grok Build and xAI as two separate integrations, and the homepage lists match the groups', () => {
    expect(toolById('xai')?.name).toBe('xAI');
    expect(toolById('grok-build')?.name).toBe('Grok Build');
    expect(toolGroups[0]!.tools.map((t) => t.id)).not.toContain('grok-build');
    expect(toolGroups[1]!.tools.map((t) => t.id)).not.toContain('xai');
    expect([...modelIds]).toEqual(toolGroups[0]!.tools.map((t) => t.id));
    expect([...agentIds]).toEqual(toolGroups[1]!.tools.map((t) => t.id));
    expect(toolGroups[1]!.line).toMatch(/planning, permissions, verification and delivery/);
  });
  it('keeps the agreed stack in two rows', () => {
    const stack = stackRows.flat().map((t) => t.name);
    for (const n of ['Ruby on Rails', 'Laravel', 'Django', 'Node.js', 'Next.js', 'React', 'Python', 'TypeScript', 'Ruby', 'PHP', 'Expo', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'Tauri', 'Electron', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Supabase']) expect(stack, n).toContain(n);
    expect(stackRows).toHaveLength(2);
  });
  it('lists Work Anywhere hosts apart from the integrations, with an official logo id each', () => {
    expect(hostingProviders.map((h) => h.name)).toEqual(['Hetzner', 'DigitalOcean', 'Vultr', 'Akamai Linode', 'AWS']);
    for (const h of hostingProviders) expect(toolGroups.flatMap((g) => g.tools).map((t) => t.id), h.id).not.toContain(h.id);
  });
  it('keeps Shopify, Supabase and Firebase among the platforms', () => {
    expect(platforms.map((p) => p.id)).toEqual(expect.arrayContaining(['shopify', 'supabase', 'firebase']));
  });
});

describe('capabilities', () => {
  it('compares eight moments, each with a before and an after', () => {
    expect(comparisons.map((c) => c.id)).toEqual(['starting', 'planning', 'implementation', 'verification', 'git', 'feedback', 'knowledge', 'models']);
    for (const c of comparisons) for (const k of ['before', 'after', 'beforeDetail', 'afterDetail'] as const) expect(c[k].length, `${c.id}.${k}`).toBeGreaterThan(10);
  });
  it('lists the Product chapters in order, with every older section kept as an anchor and no roadmap', () => {
    expect(productSections.map((s) => s.label)).toEqual(['Think', 'Build', 'Prove', 'Deliver', 'Remember and collaborate']);
    const all = [...productSections.map((s) => s.id), ...productSubAnchors];
    for (const a of ['collaborate', 'models', 'council', 'competitive', 'memory', 'live-share', 'browser', 'proof', 'production', 'delivery', 'work-anywhere', 'environments', 'voice', 'apps', 'stack', 'mobile', 'tools', 'architecture', 'board', 'experiments', 'improvement-lab', 'high-assurance', 'guardian', 'templates']) expect(all, a).toContain(a);
    expect(all).not.toContain('next');
    expect(new Set(all).size).toBe(all.length);
  });
  it('walks How It Works in six stages', () => {
    expect(howSections.map((s) => s.label)).toEqual(['Describe', 'Plan and compare', 'Build', 'Verify', 'Deliver', 'Remember']);
  });
  it('shows the agreed kinds of projects', () => {
    expect(projectExamples.map((e) => e.title).join(' ')).toMatch(/Rails.*Django.*Laravel.*Next\.js.*Expo.*Flutter.*Swift or Kotlin.*Tauri or Electron/);
  });
  it('never claims every review is independent or that models guarantee correctness', () => {
    const all = JSON.stringify({ comparisons, projectExamples });
    expect(all).not.toMatch(/every review is independent|guarantee|fully offline|never need to/i);
  });
});

describe('positioning', () => {
  it('leads with the central message', () => {
    expect(site.headline).toBe('Your AI engineering team. On your machine.');
    expect(site.subheadline).toBe('From idea to verified software.');
    expect(site.trust).toEqual(['Local-first', 'Download local AI models', 'Model-independent', 'Works with your stack', 'Free for individuals']);
  });
  it('is proprietary, never open source, and never says a coding-agent CLI is required', () => {
    for (const v of [site.tagline, site.headline, site.subheading, site.description, site.licence.summary]) expect(v).not.toMatch(/open[- ]source|apache|10x|revolutioni[sz]e|future of coding/i);
    expect(site.description).toMatch(/No coding-agent subscription required/);
    expect(site.licence.model).toBe('Proprietary');
  });
});
