/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { footerColumns, primaryNav, primaryCta, productSections, site, pricing, teams, personal, teamsMonthly } from '@/data/site';
import { toolGroups, platforms, allTools } from '@/data/integrations';
import { redirects } from '../../astro.config.mjs';

const pagesDir = new URL('../../src/pages/', import.meta.url);
const pageExists = (route: string) => {
  const p = route.replace(/#.*$/, '').replace(/^\/|\/$/g, '');
  return p === '' ? existsSync(new URL('index.astro', pagesDir)) : existsSync(new URL(`${p}.astro`, pagesDir)) || existsSync(new URL(`${p}/index.astro`, pagesDir));
};

describe('packages and pricing', () => {
  it('prices Teams at 199 USD for up to 10 engineers plus 10 USD per additional engineer', () => {
    expect(teamsMonthly(1)).toBe(199);
    expect(teamsMonthly(10)).toBe(199);
    expect(teamsMonthly(11)).toBe(209);
    expect(teamsMonthly(20)).toBe(299);
    expect(teamsMonthly(30)).toBe(399);
    expect(teamsMonthly(30) * 12).toBe(4788);
    expect(teamsMonthly(100)).toBe(1099);
  });
  it('keeps the formula constants unchanged', () => {
    expect(pricing.teams).toMatchObject({ base: 199, includedEngineers: 10, perAdditionalEngineer: 10 });
  });
  it('labels prices as planned and offers no purchase while there is no checkout', () => {
    expect(pricing.label).toBe('Planned launch pricing');
    expect(pricing.purchasable).toBe(false);
    expect(pricing.notForSale).toMatch(/isn’t on sale yet/);
  });
  it('has exactly two packages: free Personal and self-hosted Teams with SSO included', () => {
    expect(personal.price).toBe('Free');
    expect(teams.includes.join(' ')).toMatch(/SSO/);
    expect(JSON.stringify({ personal, teams })).not.toMatch(/enterprise|cloud plan|annual discount|free trial|checkout/i);
  });
});

describe('availability', () => {
  it('states download availability plainly and never claims a download that does not exist', () => {
    expect(site.release.downloadAvailable).toBe(false);
    expect(site.release.line).toMatch(/isn’t available to download yet/);
  });
});

describe('navigation', () => {
  it('has exactly the five agreed primary destinations, in order', () => {
    expect(primaryNav.map((n) => n.label)).toEqual(['Product', 'Benefits', 'Before & After', 'Integrations', 'Teams & Pricing']);
  });
  it('keeps Docs, Roadmap and How it works out of every navigation', () => {
    const all = [...primaryNav, primaryCta, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      expect(n.label, n.href).not.toMatch(/docs|documentation|roadmap|how it works/i);
      expect(n.href, n.label).not.toMatch(/^\/(docs|roadmap|how-it-works|features|cloud|ai-teams|open-source)\//);
    }
  });
  it('links only to pages that exist, with trailing slashes', () => {
    for (const n of [...primaryNav, primaryCta, ...footerColumns.flatMap((c) => c.items)]) {
      expect(n.href, n.label).toMatch(/^\/(.*\/)?$/);
      expect(pageExists(n.href), n.href).toBe(true);
    }
  });
  it('puts Download, Security, Privacy, Licence and Contact in the footer', () => {
    expect(footerColumns.flatMap((c) => c.items).map((n) => n.label)).toEqual(expect.arrayContaining(['Download', 'Security', 'Privacy', 'Licence', 'Contact']));
  });
});

describe('redirects', () => {
  const entries = Object.entries(redirects) as [string, string][];
  it('retires docs, roadmap, How it works and the feature pages', () => {
    for (const r of ['/docs/', '/roadmap/', '/how-it-works/', '/features/', '/features/factory/']) expect(redirects, r).toHaveProperty([r]);
    expect(pageExists('/docs/')).toBe(false);
    expect(pageExists('/roadmap/')).toBe(false);
    expect(pageExists('/how-it-works/')).toBe(false);
  });
  it('sends every old URL straight to a live page, never through another redirect', () => {
    const anchors = new Set(productSections.map((s) => s.id));
    for (const [from, to] of entries) {
      const path = to.replace(/#.*$/, '');
      expect(path in redirects, `${from} -> ${to}`).toBe(false);
      expect(pageExists(path), `${from} -> ${to}`).toBe(true);
      if (path === '/product/' && to.includes('#')) expect(anchors.has(to.split('#')[1]!), `${from} -> ${to}`).toBe(true);
    }
  });
});

describe('integrations', () => {
  it('has unique ids and the agreed groups', () => {
    const ids = allTools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(toolGroups.map((g) => g.key)).toEqual(['agents', 'git', 'pm', 'monitoring', 'services', 'local']);
  });
  it('treats OpenRouter as first-class and introduces Shopify, Supabase and Firebase', () => {
    expect(toolGroups[0]!.tools.map((t) => t.id)).toContain('openrouter');
    expect(platforms.map((p) => p.id)).toEqual(expect.arrayContaining(['shopify', 'supabase', 'firebase']));
  });
});

describe('positioning', () => {
  it('leads with the central message', () => {
    expect(site.headline).toBe('From prompt to verified outcome.');
  });
  it('is a proprietary Factory, never open source or a terminal', () => {
    for (const v of [site.tagline, site.headline, site.subheading, site.description, site.licence.summary]) expect(v).not.toMatch(/open[- ]source|apache|terminal/i);
    expect(site.licence.model).toBe('Proprietary');
  });
});
