/**
 * The one sample organization every Cloud demonstration uses. Everything here is
 * invented to show the layout; no real organization's data appears on the site.
 */
export const org = { name: 'Acme Engineering', slug: 'acme', members: 5, teams: 3, host: 'cloud.vekrunapp.com' } as const;

export type Person = { id: string; name: string; short: string; ini: string; role: string; hue: number; where: string };
export const people: Record<'dana' | 'sam' | 'alex' | 'priya', Person> = {
  dana: { id: 'dana', name: 'Dana Whitfield', short: 'Dana', ini: 'DW', role: 'Project manager', hue: 284, where: 'browser' },
  sam: { id: 'sam', name: 'Sam Okafor', short: 'Sam', ini: 'SO', role: 'Engineering lead', hue: 34, where: 'Vekrun · Linux' },
  alex: { id: 'alex', name: 'Alex Moreau', short: 'Alex', ini: 'AM', role: 'Developer', hue: 160, where: 'Vekrun · macOS' },
  priya: { id: 'priya', name: 'Priya Natarajan', short: 'Priya', ini: 'PN', role: 'Developer', hue: 222, where: 'Vekrun · Windows' },
};

export const workers = [
  { id: 'build-2', kind: 'shared', where: 'company build machine', state: 'busy' },
  { id: 'build-3', kind: 'shared', where: 'company build machine', state: 'idle' },
  { id: 'Alex’s machine', kind: 'personal', where: 'macOS', state: 'busy' },
  { id: 'Priya’s machine', kind: 'personal', where: 'Windows', state: 'offline' },
] as const;

export const projects = [
  { name: 'acme-api', team: 'Platform', milestone: 'Webhooks v2', pct: 72, owner: 'sam', health: 'On track', tone: 'ok', due: 'Nov 4' },
  { name: 'acme-web', team: 'Web', milestone: 'Checkout redesign', pct: 41, owner: 'priya', health: 'At risk', tone: 'warn', due: 'Nov 11' },
  { name: 'infra', team: 'Platform', milestone: 'Rate limits', pct: 90, owner: 'alex', health: 'Due this week', tone: 'info', due: 'Oct 24' },
] as const;

export const budget = { used: 184, total: 600, period: 'this week' } as const;
