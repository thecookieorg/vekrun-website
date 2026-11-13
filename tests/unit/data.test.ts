/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { footerColumns, primaryNav, primaryCta, personalCta, pricingCta, productSections, productSubAnchors, howSections, site, plans, cloudPrice, cloudYearly, cloudWishlistMailto, earlyAccessMailto, enterpriseMailto } from '@/data/site';
import { comparisons, projectExamples, highlights } from '@/data/capabilities';
import { toolGroups, platforms, allTools, stackRows } from '@/data/integrations';
import { redirects } from '../../astro.config.mjs';

const pagesDir = new URL('../../src/pages/', import.meta.url);
const pageExists = (route: string) => {
  const p = route.replace(/#.*$/, '').replace(/^\/|\/$/g, '');
  return p === '' ? existsSync(new URL('index.astro', pagesDir)) : existsSync(new URL(`${p}.astro`, pagesDir)) || existsSync(new URL(`${p}/index.astro`, pagesDir));
};

describe('plans and pricing', () => {
  it('has exactly three plans: Free, Cloud and Enterprise, in that order', () => {
    expect(plans.map((p) => p.name)).toEqual(['Free', 'Cloud', 'Enterprise']);
  });
  it('makes Free $0 forever and the only plan that is not planned', () => {
    const [free, cloud, enterprise] = plans;
    expect(free).toMatchObject({ price: '$0', priceNote: 'forever', planned: false });
    expect(cloud).toMatchObject({ price: '$99', priceNote: 'per developer / month', planned: true, status: 'Coming soon' });
    expect(cloud!.priceAlt).toBe('$1,188 per developer per year. Proposed price.');
    expect(enterprise).toMatchObject({ price: 'Custom', planned: true });
  });
  it('keeps the core engineering workflow in Free', () => {
    const f = plans[0]!.features.join(' ');
    for (const k of ['native agent', 'Council', 'Factory', 'Work Items', 'Git', 'Engineering Memory', 'Proof Packs', 'Live Share']) expect(f).toContain(k);
  });
  it('derives the yearly Cloud price from the monthly one, with no invented discount', () => {
    expect(cloudPrice.monthly).toBe(99);
    expect(cloudYearly).toBe(1188);
  });
  it('publishes no old Teams pricing, unlimited usage or purchase paths', () => {
    const all = JSON.stringify(plans);
    expect(all).not.toMatch(/\$199|\$10 |per engineer|per seat|checkout|buy now|free trial|discount|unlimited/i);
    expect(all).not.toMatch(/Vekrun Teams/);
    for (const p of plans) expect(p.cta.label).not.toMatch(/buy|purchase|subscribe/i);
  });
  it('gives each plan a working call to action', () => {
    expect(plans.map((p) => p.cta.label)).toEqual(['Request early access', 'Join the wishlist', 'Register interest']);
    expect(plans[1]!.cta.href).toBe('/pricing/#cloud-wishlist');
    expect(plans[2]!.cta.href).toBe(enterpriseMailto);
  });
});

describe('email paths', () => {
  it('sends early access, the Cloud wishlist and Enterprise interest to the support inbox', () => {
    expect(site.earlyAccess.email).toBe('support@vekrunapp.com');
    expect(earlyAccessMailto).toBe('mailto:support@vekrunapp.com?subject=Vekrun%20early%20access');
    expect(cloudWishlistMailto).toMatch(/^mailto:support@vekrunapp\.com\?subject=Vekrun%20Cloud%20wishlist&body=/);
    expect(enterpriseMailto).toMatch(/^mailto:support@vekrunapp\.com\?subject=Vekrun%20Enterprise%20interest/);
  });
  it('asks for wishlist consent and explains how to unsubscribe', () => {
    const body = decodeURIComponent(cloudWishlistMailto.split('body=')[1]!);
    expect(body).toMatch(/email me about Vekrun Cloud/);
    expect(body).toMatch(/unsubscribe/);
    expect(body).toMatch(/Individual \/ Team \/ Enterprise/);
    expect(body).toMatch(/\$99 per developer per month/);
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
  it('retires docs, roadmap, the feature pages, Benefits and Teams', () => {
    for (const r of ['/docs/', '/roadmap/', '/features/', '/features/factory/', '/benefits/', '/teams/', '/cloud/']) expect(redirects, r).toHaveProperty([r]);
    for (const r of ['/docs/', '/roadmap/', '/teams/', '/benefits/']) expect(pageExists(r), r).toBe(false);
    expect(redirects['/teams/']).toBe('/pricing/');
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
