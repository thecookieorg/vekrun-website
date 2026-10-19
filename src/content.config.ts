import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const availability = z.enum(['available', 'in-development', 'planned', 'requires-configuration']);

const integrations = defineCollection({
  loader: file('./src/content/data/integrations.json'),
  schema: z.object({
    name: z.string(),
    category: z.enum([
      'ai-providers',
      'coding-agents',
      'local-models',
      'project-management',
      'source-control',
      'developer-tools',
      'mcp-servers',
    ]),
    description: z.string(),
    connection: z.array(
      z.enum([
        'api-key',
        'oauth',
        'local-runtime',
        'cli-account',
        'mcp-remote',
        'mcp-stdio',
        'git',
        'ssh',
        'openai-compatible',
        'built-in',
      ]),
    ),
    capabilities: z.array(z.string()),
    status: availability,
    /** Short honest note shown with the status, e.g. "gated until listed in the vendor catalog". */
    note: z.string().optional(),
    /** Monogram shown in place of a logo. Vendor logos are not shipped. */
    monogram: z.string().max(2),
    docs: z.string().optional(),
    vendorUrl: z.url().optional(),
    milestone: z.string().optional(),
  }),
});

const roadmap = defineCollection({
  loader: file('./src/content/data/roadmap.json'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['planned', 'in-progress', 'implemented', 'released']),
    milestone: z.string(),
    area: z.string(),
    updated: z.string(),
    link: z.url().optional(),
    /** Platforms the work has been verified on by hand. */
    verifiedOn: z.array(z.enum(['macos', 'windows', 'linux'])).default([]),
  }),
});

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
