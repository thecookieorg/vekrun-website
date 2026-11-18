/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { footerColumns, primaryNav, primaryCta, personalCta, pricingCta, productSections, productSubAnchors, howSections, site, plans, teamsPricing, teamsMonthly, teamsInterestMailto, earlyAccessMailto } from '@/data/site';
import { comparisons, projectExamples, highlights } from '@/data/capabilities';
import { toolGroups, platforms, allTools, stackRows } from '@/data/integrations';
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
    expect(teams).toMatchObject({ price: '$199', priceNote: 'per month, includes 10 engineers', planned: true, status: 'Planned' });
    expect(teams!.priceAlt).toBe('USD. $10 per month for each additional engineer.');
  });
  it('keeps the full individual engineering platform in Free', () => {
    const f = plans[0]!.features.join(' ');
    for (const k of ['Factory', 'Coordinator', 'Council', 'Competitive Engineering', 'Work Items', 'Git', 'Engineering Memory', 'Architecture Explorer', 'Time Machine', 'Change Impact Intelligence', 'Proof Packs', 'Workflow Templates', 'Live Share', 'CLI', 'MCP']) expect(f).toContain(k);
  });
  it('describes Teams as self-hosted shared coordination', () => {
    const t = [plans[1]!.summary, ...plans[1]!.features].join(' ');
    expect(t).toMatch(/self-hosted/);
    for (const k of ['Shared Engineering Memory', 'Work Items', 'policies', 'your servers', 'your infrastructure', 'installations', 'verification', 'Git']) expect(t).toContain(k);
  });
  it('prices Teams at $199 for up to 10 engineers and $10 for each one after', () => {
    expect(teamsPricing).toEqual({ base: 199, included: 10, perExtra: 10, currency: 'USD' });
    for (const [n, price] of [[1, 199], [5, 199], [10, 199], [11, 209], [12, 219], [20, 299], [30, 399], [100, 1099]] as const) expect(teamsMonthly(n), `${n} engineers`).toBe(price);
  });
  it('never charges for fewer than one engineer or fractional engineers', () => {
    expect(teamsMonthly(0)).toBe(199);
    expect(teamsMonthly(10.9)).toBe(199);
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
    expect(body).toMatch(/Number of engineers:/);
    expect(body).toMatch(/our own servers/);
  });
});

describe('availability', () => {
  it('states download availability plainly and never claims a download that does not exist', () => {
    expect(site.release.downloadAvailable).toBe(false);
    expect(site.release.line).toMatch(/isn’t available to download yet/);
  });
});

describe('navigation', () => {
  it('has Product, How It Works, Before & After and Pricing, with Get Vekrun as the call to action', () => {
    expect(primaryNav.map((n) => n.label)).toEqual(['Product', 'How It Works', 'Before & After', 'Pricing']);
    expect(primaryCta).toEqual({ label: 'Get Vekrun', href: '/download/' });
  });
  it('keeps Docs and Roadmap out of every navigation', () => {
    const all = [...primaryNav, primaryCta, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      expect(n.label, n.href).not.toMatch(/docs|documentation|roadmap|teams|benefits/i);
      expect(n.href, n.label).not.toMatch(/^\/(docs|roadmap|features|cloud|teams|benefits|ai-teams|open-source)\//);
    }
  });
  it('links only to pages that exist, with trailing slashes', () => {
    for (const n of [...primaryNav, primaryCta, personalCta, pricingCta, ...footerColumns.flatMap((c) => c.items)]) {
      expect(n.href, n.label).toMatch(/^\/(.*\/)?$/);
      expect(pageExists(n.href), n.href).toBe(true);
    }
  });
  it('puts Integrations, Get Vekrun, Security, Privacy, Licence and Contact in the footer', () => {
    expect(footerColumns.flatMap((c) => c.items).map((n) => n.label)).toEqual(expect.arrayContaining(['Integrations', 'Get Vekrun', 'Security', 'Privacy', 'Licence', 'Contact']));
  });
});

describe('redirects', () => {
  const entries = Object.entries(redirects) as [string, string][];
  it('retires docs, roadmap, the feature pages, Benefits and the old Teams and Cloud pages', () => {
    for (const r of ['/docs/', '/roadmap/', '/features/', '/features/factory/', '/benefits/', '/teams/', '/cloud/']) expect(redirects, r).toHaveProperty([r]);
    for (const r of ['/docs/', '/roadmap/', '/teams/', '/benefits/']) expect(pageExists(r), r).toBe(false);
    expect(redirects['/teams/']).toBe('/pricing/#teams');
    expect(redirects['/cloud/']).toBe('/pricing/#teams');
    expect(redirects['/benefits/']).toBe('/before-and-after/');
  });
  it('serves How It Works, Before & After and Pricing as real pages', () => {
    for (const r of ['/how-it-works/', '/before-and-after/', '/pricing/']) {
      expect(redirects, r).not.toHaveProperty([r]);
      expect(pageExists(r), r).toBe(true);
    }
  });
  it('sends every old URL straight to a live page and a real section, never through another redirect', () => {
    const anchors: Record<string, Set<string>> = {
      '/product/': new Set([...productSections.map((s) => s.id), ...productSubAnchors]),
      '/how-it-works/': new Set([...howSections.map((s) => s.id), 'inbox']),
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
  it('has unique ids and puts the native agent first, then optional coding agents', () => {
    const ids = allTools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(toolGroups.map((g) => g.key)).toEqual(['models', 'agents', 'pm', 'git', 'monitoring', 'context']);
    expect(toolGroups[0]!.title).toMatch(/native agent/);
    expect(toolGroups[1]!.title).toMatch(/Optional/);
    expect(toolGroups[1]!.line).toMatch(/None of them is required/);
  });
  it('lists the shipped models and coding CLIs, and nothing that only connects through MCP', () => {
    expect(toolGroups[0]!.tools.map((t) => t.id)).toEqual(['openrouter', 'ollama', 'lm-studio']);
    expect(toolGroups[1]!.tools.map((t) => t.id)).toEqual(['claude-code', 'codex', 'antigravity']);
    const ids = allTools.map((t) => t.id);
    for (const gone of ['gemini-cli', 'kamal', 'docker', 'vercel', 'cloudflare', 'supabase', 'stripe', 'postgres', 'pagerduty', 'llama-cpp']) expect(ids, gone).not.toContain(gone);
    expect(ids).toContain('obsidian');
  });
  it('shows the agreed stack in two marquee rows', () => {
    const stack = stackRows.flat().map((t) => t.name);
    for (const n of ['Ruby on Rails', 'Laravel', 'Django', 'Node.js', 'Next.js', 'React', 'Python', 'TypeScript', 'Ruby', 'PHP', 'Expo', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'Tauri', 'Electron', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Supabase']) expect(stack, n).toContain(n);
    expect(stackRows).toHaveLength(2);
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
  it('links every homepage highlight to a real Product section', () => {
    const ids = new Set(productSections.map((s) => s.id));
    for (const h of highlights) expect(ids.has(h.id), h.id).toBe(true);
  });
  it('shows the agreed kinds of projects', () => {
    expect(projectExamples.map((e) => e.title).join(' ')).toMatch(/Rails.*Django.*Laravel.*Next\.js.*Expo.*Flutter.*Swift or Kotlin.*Tauri or Electron/);
  });
  it('never claims every review is independent or that models guarantee correctness', () => {
    const all = JSON.stringify({ comparisons, highlights, projectExamples });
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
