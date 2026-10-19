/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { availability, connectionMethods, integrationCategories, roadmapStatuses, footerColumns, primaryNav, featurePages, site } from '@/data/site';

const read = (p: string) => JSON.parse(readFileSync(new URL(`../../src/content/data/${p}`, import.meta.url), 'utf8'));
const integrations: any[] = read('integrations.json');
const roadmap: any[] = read('roadmap.json');
const milestones: any[] = read('milestones.json');
const releases: any[] = read('releases.json');

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

describe('integrations catalog', () => {
  it('has unique ids', () => {
    const ids = integrations.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('uses only the shared availability, category and connection vocabularies', () => {
    for (const i of integrations) {
      expect(Object.keys(availability)).toContain(i.status);
      expect(Object.keys(integrationCategories)).toContain(i.category);
      for (const c of i.connection) expect(Object.keys(connectionMethods)).toContain(c);
    }
  });
  it('never marks a coding-agent account or an MCP server as available (none is implemented)', () => {
    for (const i of integrations.filter((x) => x.category === 'coding-agents' || x.category === 'mcp-servers')) {
      expect(i.status, i.id).not.toBe('available');
    }
  });
  it('gives every available entry a milestone that is implemented or in progress', () => {
    const okMilestones = new Set(milestones.filter((m) => m.status !== 'planned').map((m) => `M${m.number}`));
    for (const i of integrations.filter((x) => x.status === 'available')) {
      expect(okMilestones.has(i.milestone), `${i.id} claims available in ${i.milestone}`).toBe(true);
    }
  });
  it('only links to internal docs pages with a trailing slash', () => {
    for (const i of integrations) if (i.docs) expect(i.docs).toMatch(/^\/docs\/.+\/$/);
  });
});

describe('roadmap', () => {
  it('has unique ids and valid statuses and dates', () => {
    const ids = roadmap.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of roadmap) {
      expect(Object.keys(roadmapStatuses)).toContain(r.status);
      expect(r.updated).toMatch(isoDate);
      expect(r.milestone).toMatch(/^M(1[0-2]|[1-9])$/);
    }
  });
  it('lists twelve milestones in order', () => {
    expect(milestones.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
  it('marks nothing as released while there are no releases', () => {
    if (releases.length === 0) {
      for (const r of roadmap) expect(r.status).not.toBe('released');
      for (const m of milestones) expect(m.status).not.toBe('released');
    }
  });
  it('only claims implemented work was verified somewhere', () => {
    for (const r of roadmap.filter((x) => x.status === 'implemented')) expect(r.verifiedOn.length, r.id).toBeGreaterThan(0);
  });
  it('never dates an entry after the reconciliation date', () => {
    for (const r of roadmap) expect(r.updated <= site.status.asOf, r.id).toBe(true);
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

describe('navigation', () => {
  it('uses internal links with trailing slashes', () => {
    const all = [...primaryNav, ...featurePages, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      if (n.href.startsWith('http')) continue;
      expect(n.href, n.label).toMatch(/^\/(#.*|.*\/(#.*)?)?$/);
    }
  });
  it('does not expose the repository while it is private', () => {
    if (!site.repo.public) expect(primaryNav.some((n) => n.href.includes('github.com'))).toBe(false);
  });
});
