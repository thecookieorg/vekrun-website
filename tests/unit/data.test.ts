/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { availability, connectionMethods, integrationCategories, roadmapAreas, roadmapStatuses, footerColumns, primaryNav, productPages, advancedPages, site, pricing, teams, personal, teamsMonthly } from '@/data/site';
import { capabilities } from '@/data/capabilities';

const read = (p: string) => JSON.parse(readFileSync(new URL(`../../src/content/data/${p}`, import.meta.url), 'utf8'));
const integrations: any[] = read('integrations.json');
const roadmap: any[] = read('roadmap.json');
const milestones: any[] = read('milestones.json');
const releases: any[] = read('releases.json');

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const jargon = /\b(Rust|Tauri|SQLite|PTY|DAG|IPC|lease|state machine|control plane|policy engine)\b/i;

describe('integrations catalog', () => {
  it('has unique ids', () => {
    const ids = integrations.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('uses only the shared availability, category and connection vocabularies', () => {
    for (const i of integrations) {
      expect(Object.keys(availability), i.id).toContain(i.status);
      expect(Object.keys(integrationCategories), i.id).toContain(i.category);
      for (const c of i.connection) expect(Object.keys(connectionMethods), i.id).toContain(c);
    }
  });
  it('marks only Claude Code as a verified coding CLI (the only one run live)', () => {
    for (const i of integrations.filter((x) => x.connection.includes('cli-account'))) {
      if (i.id !== 'claude-code') expect(i.status, i.id).not.toBe('available');
    }
  });
  it('never marks a tracker, monitoring, delivery or service connection as verified until it has run against the live service', () => {
    for (const i of integrations.filter((x) => ['project-management', 'source-control', 'monitoring', 'ci-delivery', 'models'].includes(x.category))) {
      expect(i.status, i.id).not.toBe('available');
    }
  });
  it('explains each entry in user language, without engineering jargon', () => {
    for (const i of integrations) {
      expect(i.enables.length, i.id).toBeGreaterThan(20);
      expect(i.enables, i.id).not.toMatch(jargon);
    }
  });
  it('only links to internal docs pages with a trailing slash', () => {
    for (const i of integrations) if (i.docs) expect(i.docs).toMatch(/^\/docs\/.+\/$/);
  });
});

describe('roadmap', () => {
  it('has unique ids and valid statuses, areas and dates', () => {
    const ids = roadmap.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of roadmap) {
      expect(Object.keys(roadmapStatuses), r.id).toContain(r.status);
      expect(Object.keys(roadmapAreas), r.id).toContain(r.area);
      expect(r.updated, r.id).toMatch(isoDate);
    }
  });
  it('covers every public area', () => {
    for (const area of Object.keys(roadmapAreas)) expect(roadmap.some((r) => r.area === area), area).toBe(true);
  });
  it('is written for users, without milestone ids or engineering jargon', () => {
    for (const r of roadmap) {
      expect(`${r.title} ${r.description}`, r.id).not.toMatch(jargon);
      expect(`${r.title} ${r.description}`, r.id).not.toMatch(/\bM(1[0-2]|[1-9])\b/);
    }
  });
  it('marks nothing as released while there are no releases', () => {
    if (releases.length === 0) {
      for (const r of roadmap) expect(r.status, r.id).not.toBe('released');
      for (const m of milestones) expect(m.status, m.id).not.toBe('released');
    }
  });
  it('keeps proposed entries out of implemented or in-progress states', () => {
    for (const r of roadmap.filter((x) => x.status === 'proposed')) expect((r.verifiedOn ?? []).length, r.id).toBe(0);
  });
  it('only claims implemented work was verified somewhere', () => {
    for (const r of roadmap.filter((x) => x.status === 'implemented')) expect(r.verifiedOn.length, r.id).toBeGreaterThan(0);
  });
  it('never dates an entry after the reconciliation date', () => {
    for (const r of roadmap) expect(r.updated <= site.status.asOf, r.id).toBe(true);
  });
  it('keeps every Teams entry planned until a Teams Coordinator exists', () => {
    for (const r of roadmap.filter((x) => x.area === 'teams')) {
      if (capabilities.teamsCoordinator.status === 'planned') expect(r.status, r.id).toBe('planned');
    }
  });
  it('never mentions Vekrun Cloud or open source', () => {
    for (const r of roadmap) expect(`${r.title} ${r.description} ${r.note ?? ''}`, r.id).not.toMatch(/vekrun cloud|apache|(vekrun|source code) (is|will be) (free and )?open|publish(ed)? the source/i);
  });
  it('lists twelve engineering milestones for the contributor page', () => {
    expect(milestones.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});

describe('releases', () => {
  it('has well-formed artifacts when present', () => {
    for (const rel of releases) {
      expect(rel.date).toMatch(isoDate);
      for (const a of rel.artifacts) {
        expect(a.sha256).toMatch(/^[a-f0-9]{64}$/);
        expect(a.url).toMatch(/^https:\/\//);
      }
    }
  });
});

describe('packages and pricing', () => {
  it('prices Teams at 199 USD for up to 10 engineers plus 10 USD per additional engineer', () => {
    expect(teamsMonthly(1)).toBe(199);
    expect(teamsMonthly(10)).toBe(199);
    expect(teamsMonthly(11)).toBe(209);
    expect(teamsMonthly(30)).toBe(399);
    expect(teamsMonthly(30) * 12).toBe(4788);
    expect(teamsMonthly(100)).toBe(1099);
  });
  it('labels prices as planned and offers no purchase while there is no checkout', () => {
    expect(pricing.label).toBe('Planned launch pricing');
    expect(pricing.purchasable).toBe(false);
    expect(pricing.notForSale).toMatch(/not available to buy yet/);
  });
  it('has exactly two packages: free Personal and self-hosted Teams with SSO included', () => {
    expect(personal.price).toBe('Free');
    expect(teams.includes.join(' ')).toMatch(/SSO/);
    expect(JSON.stringify({ personal, teams })).not.toMatch(/enterprise|cloud plan|annual discount|free trial|checkout/i);
  });
});

describe('navigation and positioning', () => {
  it('uses internal links with trailing slashes', () => {
    const all = [...primaryNav, ...productPages, ...advancedPages, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      if (n.href.startsWith('http')) continue;
      expect(n.href, n.label).toMatch(/^\/(#.*|.*\/(#.*)?)?$/);
    }
  });
  it('keeps the navigation compact and Factory-first', () => {
    expect(primaryNav.map((n) => n.label)).toEqual(['Product', 'How it works', 'Teams & Pricing', 'Integrations', 'Docs', 'Roadmap']);
    expect(productPages[0]!.key).toBe('factory');
  });
  it('never links to retired routes', () => {
    const all = [...primaryNav, ...productPages, ...advancedPages, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) expect(n.href, n.label).not.toMatch(/^\/(cloud|ai-teams|open-source)\//);
  });
  it('positions Vekrun as a proprietary Factory, never as open source or a terminal', () => {
    for (const v of [site.tagline, site.headline, site.description, site.shortDescription, site.licence.summary]) {
      expect(v).not.toMatch(/open[- ]source|apache|terminal/i);
    }
    expect(site.licence.model).toBe('Proprietary');
    expect(site.repo.public).toBe(false);
  });
});
