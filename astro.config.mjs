// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://vekrunapp.com';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  // Old URLs from the first information architecture. Static builds emit meta-refresh pages.
  redirects: {
    '/factory/': '/ai-teams/',
    '/features/planning/': '/ai-teams/',
    '/features/agent-platform/': '/docs/advanced/architecture/',
    '/docs/ai/providers/': '/docs/ai-coding/choosing-models/',
    '/docs/ai/agent-modes/': '/docs/ai-coding/coding-sessions/',
    '/docs/ai/permissions/': '/docs/ai-coding/permissions/',
    '/docs/ai/context-management/': '/docs/ai-coding/coding-sessions/',
    '/docs/factory/agent-teams/': '/docs/ai-teams/factory/',
    '/docs/factory/planning/': '/docs/ai-teams/planning/',
    '/docs/factory/council/': '/docs/ai-teams/council/',
    '/docs/factory/scheduling/': '/docs/ai-teams/running-agent-tasks/',
    '/docs/factory/verification/': '/docs/ai-teams/running-agent-tasks/',
    '/docs/factory/worktrees/': '/docs/git/worktrees/',
    '/docs/board/integrations/': '/docs/board/connecting-a-tracker/',
    '/docs/board/repository-mapping/': '/docs/board/viewing-tickets/',
    '/docs/board/ticket-synchronization/': '/docs/board/status-synchronization/',
    '/docs/getting-started/connecting-a-provider/': '/docs/getting-started/connecting-ai/',
    '/docs/getting-started/local-models/': '/docs/ai-coding/choosing-models/',
    '/docs/getting-started/terminal-setup/': '/docs/terminal/shell-configuration/',
    '/docs/terminal/themes/': '/docs/terminal/customization/',
    '/docs/advanced/self-hosting/': '/docs/advanced/remote-workers/',
    '/docs/advanced/cli/': '/docs/advanced/apis/',
    '/docs/advanced/agent-apis/': '/docs/advanced/apis/',
    '/docs/advanced/extension-development/': '/docs/advanced/contributing/',
    '/docs/contributing/build-from-source/': '/docs/advanced/contributing/',
    '/docs/contributing/architecture/': '/docs/advanced/architecture/',
    '/docs/contributing/contribution-process/': '/docs/advanced/contributing/',
    '/docs/contributing/testing/': '/docs/advanced/contributing/',
    '/docs/contributing/security-reporting/': '/docs/settings/credentials/',
  },
  build: { format: 'directory' },
  integrations: [
    starlight({
      title: 'Vekrun Docs',
      description: 'Documentation for Vekrun, the open-source developer workspace.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/starlight.css'],
      disable404Route: true,
      lastUpdated: false,
      pagination: true,
      components: {
        SiteTitle: './src/components/docs/DocsSiteTitle.astro',
      },
      sidebar: [
        { label: 'Overview', link: '/docs/' },
        { label: 'Getting started', items: [{ autogenerate: { directory: 'docs/getting-started' } }] },
        { label: 'Terminal', items: [{ autogenerate: { directory: 'docs/terminal' } }] },
        { label: 'AI coding', items: [{ autogenerate: { directory: 'docs/ai-coding' } }] },
        { label: 'Board and integrations', items: [{ autogenerate: { directory: 'docs/board' } }] },
        { label: 'AI Teams', items: [{ autogenerate: { directory: 'docs/ai-teams' } }] },
        { label: 'Git and code reviews', items: [{ autogenerate: { directory: 'docs/git' } }] },
        { label: 'Settings and privacy', items: [{ autogenerate: { directory: 'docs/settings' } }] },
        { label: 'Advanced', items: [{ autogenerate: { directory: 'docs/advanced' } }] },
      ],
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: `${site}/og/default.png` } },
      ],
    }),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
