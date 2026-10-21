import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const availability = z.enum(['available', 'in-development', 'planned', 'proposed']);

const integrations = defineCollection({
  loader: file('./src/content/data/integrations.json'),
  schema: z.object({
    name: z.string(),
    category: z.enum(['ai-models', 'coding-tools', 'project-management', 'git-hosting', 'monitoring', 'ci-cd', 'deployment', 'security', 'flags-analytics', 'developer-services']),
    /** One sentence: what connecting this lets you do. */
    enables: z.string(),
    connection: z.array(z.enum(['api-key', 'oauth', 'local-runtime', 'cli-account', 'mcp', 'git', 'ssh', 'openai-compatible', 'built-in'])),
    status: availability,
    /** Short honest note, e.g. "needs your own app credentials". */
    note: z.string().optional(),
    monogram: z.string().max(2),
    docs: z.string().optional(),
    vendorUrl: z.url().optional(),
  }),
});

const roadmap = defineCollection({
  loader: file('./src/content/data/roadmap.json'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['planned', 'in-progress', 'implemented', 'proposed', 'released']),
    area: z.enum(['terminal', 'ai-coding', 'board', 'ai-teams', 'code-review', 'insights', 'ci-cd', 'deployment', 'security', 'integrations', 'releases']),
    /** Optional one-line priority or capability note shown with the entry. */
    note: z.string().optional(),
    updated: z.string(),
    /** Platforms the work has been verified on by hand. */
    verifiedOn: z.array(z.enum(['macos', 'windows', 'linux'])).default([]),
  }),
});

/** Engineering milestones. Shown only on the contributor progress page in the docs. */
const milestones = defineCollection({
  loader: file('./src/content/data/milestones.json'),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    summary: z.string(),
    status: z.enum(['planned', 'in-progress', 'implemented', 'released']),
    note: z.string().optional(),
    updated: z.string(),
  }),
});

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });
const i18n = defineCollection({ loader: i18nLoader(), schema: i18nSchema() });

export const collections = { integrations, roadmap, milestones, docs, i18n };
