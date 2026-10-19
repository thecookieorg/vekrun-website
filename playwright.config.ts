import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests run against the production build served by `astro preview`,
 * so they exercise exactly what GitHub Pages will serve.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4329',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'pnpm preview --port 4329',
    url: 'http://localhost:4329',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
