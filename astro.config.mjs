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
        { label: 'AI', items: [{ autogenerate: { directory: 'docs/ai' } }] },
        { label: 'Factory', items: [{ autogenerate: { directory: 'docs/factory' } }] },
        { label: 'Board', items: [{ autogenerate: { directory: 'docs/board' } }] },
        { label: 'Advanced', items: [{ autogenerate: { directory: 'docs/advanced' } }] },
        { label: 'Contributing', items: [{ autogenerate: { directory: 'docs/contributing' } }] },
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
