// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://vekrunapp.com';

/**
 * Retired routes. GitHub Pages serves static files only, so each one becomes a
 * small meta-refresh page with a canonical link to its new home. Every target is
 * a live page; nothing chains through another redirect.
 *
 * The public documentation portal, the public roadmap and the per-feature
 * pages were retired on 2026-11-01. Their sources are kept in git under the tag
 * archive/docs-and-roadmap-2026-11-01. Benefits and Teams were retired on
 * 2026-11-12, when pricing became Free, Cloud and Enterprise; Benefits now
 * points at Before & After, which was restored as a page.
 *
 * The workflow sections (council, factory, verification, inbox, git) moved
 * from Product to How It Works; `product()` sends those anchors there.
 */
const howAnchors = new Set(['how', 'council', 'factory', 'verification', 'inbox', 'git']);
const product = (anchor = '') =>
  howAnchors.has(anchor) ? `/how-it-works/${anchor === 'how' ? '' : `#${anchor}`}` : `/product/${anchor ? `#${anchor}` : ''}`;

/** Old documentation pages, by topic, to the closest page that now covers it. */
const docsTargets = {
  '/docs/': product(),
  '/docs/getting-started/installation/': '/download/',
  '/docs/getting-started/connecting-tools/': '/integrations/',
  '/docs/getting-started/importing-a-repository/': product('factory'),
  '/docs/getting-started/validating-the-environment/': product('factory'),
  '/docs/getting-started/first-outcome/': product('factory'),
  '/docs/getting-started/inspecting-evidence/': product('verification'),
  '/docs/getting-started/mobile-and-teams/': product('mobile'),
  '/docs/factory/overview/': product('factory'),
  '/docs/factory/planning/': product('council'),
  '/docs/factory/council/': product('council'),
  '/docs/factory/running-agent-tasks/': product('factory'),
  '/docs/board/connecting-a-tracker/': '/integrations/',
  '/docs/board/github-and-gitlab-issues/': product('board'),
  '/docs/board/start-work/': product('board'),
  '/docs/board/status-synchronization/': product('board'),
  '/docs/board/viewing-tickets/': product('board'),
  '/docs/insights/overview/': product('board'),
  '/docs/insights/connecting/': '/integrations/',
  '/docs/insights/providers/': '/integrations/',
  '/docs/insights/viewing-errors/': product('board'),
  '/docs/insights/performance/': product('board'),
  '/docs/insights/investigate-and-fix/': product('board'),
  '/docs/insights/creating-tickets/': product('board'),
  '/docs/insights/generating-plans/': product('board'),
  '/docs/insights/delegating-to-factory/': product('board'),
  '/docs/insights/reviewing-repairs/': product('verification'),
  '/docs/insights/production-verification/': product('verification'),
  '/docs/insights/security/': '/security/',
  '/docs/git/ai-reviews/': product('inbox'),
  '/docs/git/review-inbox/': product('inbox'),
  '/docs/git/pull-requests/': product('verification'),
  '/docs/git/branches/': product('tools'),
  '/docs/git/worktrees/': product('tools'),
  '/docs/pipelines/overview/': product('verification'),
  '/docs/pipelines/ci-cd/': product('verification'),
  '/docs/pipelines/local-testing/': product('verification'),
  '/docs/pipelines/deployment-verification/': product('verification'),
  '/docs/pipelines/incidents-and-flags/': product('board'),
  '/docs/pipelines/security-findings/': '/security/',
  '/docs/settings/providers/': '/integrations/',
  '/docs/settings/credentials/': '/security/',
  '/docs/settings/permissions/': '/security/',
  '/docs/settings/data-storage/': '/privacy/',
  '/docs/ai-coding/choosing-models/': product('models'),
  '/docs/ai-coding/openrouter/': product('models'),
  '/docs/ai-coding/coding-sessions/': product('tools'),
  '/docs/ai-coding/editing-code/': product('tools'),
  '/docs/ai-coding/permissions/': '/security/',
  '/docs/terminal/tabs-and-panes/': product('tools'),
  '/docs/terminal/ssh/': product('tools'),
  '/docs/terminal/shell-configuration/': product('tools'),
  '/docs/terminal/keybindings/': product('tools'),
  '/docs/terminal/customization/': product('tools'),
  '/docs/advanced/architecture/': product(),
  '/docs/advanced/agent-runtime/': product(),
  '/docs/advanced/apis/': product(),
  '/docs/advanced/rust-internals/': product(),
  '/docs/advanced/progress/': product(),
  '/docs/advanced/mcp/': '/integrations/',
  '/docs/advanced/remote-workers/': '/pricing/',
  // Older documentation addresses that already redirected once.
  '/docs/ai/providers/': '/integrations/',
  '/docs/ai/agent-modes/': product('tools'),
  '/docs/ai/permissions/': '/security/',
  '/docs/ai/context-management/': product('tools'),
  '/docs/factory/agent-teams/': product('factory'),
  '/docs/factory/scheduling/': product('factory'),
  '/docs/factory/verification/': product('verification'),
  '/docs/factory/worktrees/': product('tools'),
  '/docs/ai-teams/factory/': product('factory'),
  '/docs/ai-teams/planning/': product('council'),
  '/docs/ai-teams/council/': product('council'),
  '/docs/ai-teams/running-agent-tasks/': product('factory'),
  '/docs/advanced/contributing/': '/license/',
  '/docs/board/integrations/': '/integrations/',
  '/docs/board/repository-mapping/': product('board'),
  '/docs/board/ticket-synchronization/': product('board'),
  '/docs/getting-started/connecting-a-provider/': '/integrations/',
  '/docs/getting-started/connecting-ai/': '/integrations/',
  '/docs/getting-started/opening-a-project/': product('factory'),
  '/docs/getting-started/first-launch/': '/download/',
  '/docs/getting-started/local-models/': product('models'),
  '/docs/getting-started/terminal-setup/': product('tools'),
  '/docs/terminal/themes/': product('tools'),
  '/docs/advanced/self-hosting/': '/pricing/',
  '/docs/advanced/cli/': product(),
  '/docs/advanced/agent-apis/': product(),
  '/docs/advanced/extension-development/': product(),
  '/docs/contributing/build-from-source/': '/download/',
  '/docs/contributing/architecture/': product(),
  '/docs/contributing/contribution-process/': '/license/',
  '/docs/contributing/testing/': product(),
  '/docs/contributing/security-reporting/': '/security/',
};

export const redirects = {
  // Retired marketing pages.
  '/features/': product(),
  '/features/factory/': product('factory'),
  '/features/board/': product('board'),
  '/features/inbox/': product('inbox'),
  '/features/verification/': product('verification'),
  '/features/engineering-memory/': product('memory'),
  '/features/mobile/': product('mobile'),
  '/features/terminal/': product('tools'),
  '/features/ai-coding/': product('tools'),
  '/features/code-review/': product('inbox'),
  '/features/insights/': product('board'),
  '/features/planning/': product('council'),
  '/features/agent-platform/': product(),
  '/features/ai-teams/': product('factory'),
  '/roadmap/': product(),
  // Earlier repositioning.
  '/cloud/': '/pricing/#cloud-wishlist',
  '/teams/': '/pricing/',
  '/benefits/': '/before-and-after/',
  '/ai-teams/': product('factory'),
  '/factory/': product('factory'),
  '/open-source/': '/license/',
  ...docsTargets,
};

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  redirects,
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Only real pages: no 404 and no redirect stubs.
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.includes('/404') && !(path in redirects);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
