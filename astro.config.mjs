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
    // The 2026-10-28 repositioning: Cloud became self-hosted Teams, AI Teams became
    // AI Factory, the open-source page became the licence page.
    '/cloud/': '/teams/',
    '/pricing/': '/teams/#pricing',
    '/ai-teams/': '/features/factory/',
    '/factory/': '/features/factory/',
    '/features/ai-teams/': '/features/factory/',
    '/open-source/': '/license/',
    '/features/insights/': '/features/board/#incidents',
    '/features/planning/': '/features/factory/',
    '/features/agent-platform/': '/docs/advanced/architecture/',
    '/docs/ai/providers/': '/docs/ai-coding/choosing-models/',
    '/docs/ai/agent-modes/': '/docs/ai-coding/coding-sessions/',
    '/docs/ai/permissions/': '/docs/ai-coding/permissions/',
    '/docs/ai/context-management/': '/docs/ai-coding/coding-sessions/',
    '/docs/factory/agent-teams/': '/docs/factory/overview/',
    '/docs/factory/scheduling/': '/docs/factory/running-agent-tasks/',
    '/docs/factory/verification/': '/docs/factory/running-agent-tasks/',
    '/docs/ai-teams/factory/': '/docs/factory/overview/',
    '/docs/ai-teams/planning/': '/docs/factory/planning/',
    '/docs/ai-teams/council/': '/docs/factory/council/',
    '/docs/ai-teams/running-agent-tasks/': '/docs/factory/running-agent-tasks/',
    '/docs/advanced/contributing/': '/license/',
    '/docs/factory/worktrees/': '/docs/git/worktrees/',
    '/docs/board/integrations/': '/docs/board/connecting-a-tracker/',
    '/docs/board/repository-mapping/': '/docs/board/viewing-tickets/',
    '/docs/board/ticket-synchronization/': '/docs/board/status-synchronization/',
    '/docs/getting-started/connecting-a-provider/': '/docs/getting-started/connecting-tools/',
    '/docs/getting-started/connecting-ai/': '/docs/getting-started/connecting-tools/',
    '/docs/getting-started/opening-a-project/': '/docs/getting-started/importing-a-repository/',
    '/docs/getting-started/first-launch/': '/docs/getting-started/installation/',
    '/docs/getting-started/local-models/': '/docs/ai-coding/choosing-models/',
    '/docs/getting-started/terminal-setup/': '/docs/terminal/shell-configuration/',
    '/docs/terminal/themes/': '/docs/terminal/customization/',
    '/docs/advanced/self-hosting/': '/docs/advanced/remote-workers/',
    '/docs/advanced/cli/': '/docs/advanced/apis/',
    '/docs/advanced/agent-apis/': '/docs/advanced/apis/',
    '/docs/advanced/extension-development/': '/docs/advanced/architecture/',
    '/docs/contributing/build-from-source/': '/docs/getting-started/installation/',
    '/docs/contributing/architecture/': '/docs/advanced/architecture/',
    '/docs/contributing/contribution-process/': '/license/',
    '/docs/contributing/testing/': '/docs/advanced/architecture/',
    '/docs/contributing/security-reporting/': '/docs/settings/credentials/',
  },
  build: { format: 'directory' },
  integrations: [
    starlight({
      title: 'Vekrun Docs',
      description: 'Documentation for Vekrun, the AI software engineering Factory.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/starlight.css'],
      disable404Route: true,
      lastUpdated: false,
      pagination: true,
      components: {
        SiteTitle: './src/components/docs/DocsSiteTitle.astro',
        ThemeProvider: './src/components/docs/ThemeProvider.astro',
        ThemeSelect: './src/components/docs/ThemeSelect.astro',
      },
      sidebar: [
        { label: 'Overview', link: '/docs/' },
        { label: 'Getting started', items: [{ autogenerate: { directory: 'docs/getting-started' } }] },
        { label: 'AI Factory', items: [{ autogenerate: { directory: 'docs/factory' } }] },
        { label: 'Board and trackers', items: [{ autogenerate: { directory: 'docs/board' } }] },
        { label: 'Production incidents', items: [{ autogenerate: { directory: 'docs/insights' } }] },
        { label: 'Git, pull requests and reviews', items: [{ autogenerate: { directory: 'docs/git' } }] },
        { label: 'CI, delivery and security', items: [{ autogenerate: { directory: 'docs/pipelines' } }] },
        { label: 'Settings and privacy', items: [{ autogenerate: { directory: 'docs/settings' } }] },
        { label: 'Advanced: coding sessions', collapsed: true, items: [{ autogenerate: { directory: 'docs/ai-coding' } }] },
        { label: 'Advanced: terminal and SSH', collapsed: true, items: [{ autogenerate: { directory: 'docs/terminal' } }] },
        { label: 'Technical reference', collapsed: true, items: [{ autogenerate: { directory: 'docs/advanced' } }] },
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
