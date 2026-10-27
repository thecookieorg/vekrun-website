/**
 * Guards for the structured content the site is generated from.
 * These run without Astro so they stay fast and catch editing mistakes early.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { availability, connectionMethods, integrationCategories, roadmapAreas, roadmapStatuses, footerColumns, primaryNav, featurePages, site, cloud } from '@/data/site';

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
  it('never marks a coding-agent account as available (none is implemented)', () => {
    for (const i of integrations) {
      if (i.connection.includes('cli-account')) expect(i.status, i.id).not.toBe('available');
    }
  });
  it('never marks a tracker, monitoring or developer-service connection as available until it has run against the live service', () => {
    for (const i of integrations.filter((x) => ['project-management', 'developer-services', 'monitoring', 'ci-cd', 'deployment', 'security', 'flags-analytics'].includes(x.category))) {
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
  it('never claims Cloud work beyond the product status set in site.ts', () => {
    const order = ['planned', 'in-progress', 'implemented', 'released'];
    for (const r of roadmap.filter((x) => x.area === 'cloud')) {
      expect(order.indexOf(r.status), r.id).toBeLessThanOrEqual(order.indexOf(cloud.status));
      if (cloud.status === 'planned') expect((r.verifiedOn ?? []).length, r.id).toBe(0);
    }
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

describe('navigation and positioning', () => {
  it('uses internal links with trailing slashes', () => {
    const all = [...primaryNav, ...featurePages, ...footerColumns.flatMap((c) => c.items)];
    for (const n of all) {
      if (n.href.startsWith('http')) continue;
      expect(n.href, n.label).toMatch(/^\/(#.*|.*\/(#.*)?)?$/);
    }
  });
  it('keeps the navigation compact', () => {
    expect(primaryNav.length).toBeLessThanOrEqual(6);
    expect(featurePages.length).toBe(6);
  });
  it('keeps Cloud as one destination: a top-level link, a footer link, no subproduct links', () => {
    expect(primaryNav.filter((n) => n.href === cloud.href)).toHaveLength(1);
    expect(primaryNav.some((n) => n.label === 'AI Teams')).toBe(false);
    const product = footerColumns.find((c) => c.title === 'Product')!;
    expect(product.items.filter((i) => i.href.startsWith('/cloud'))).toHaveLength(1);
  });
  it('does not expose the application repository while it is private', () => {
    if (!site.repo.public) expect(primaryNav.some((n) => n.href.includes('github.com'))).toBe(false);
  });
  it('never claims the project is built in the open while the repository is private', () => {
    if (!site.repo.public) {
      for (const v of [site.description, site.shortDescription, site.status.line, site.status.meaning]) expect(v).not.toMatch(/built in the open/i);
    }
  });
});
