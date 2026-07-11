// Browser test contract per docs/TEST_PLAN.md: viewport matrix 1920/1440/820/390,
// Chromium and WebKit blocking, Firefox behavioral-blocking (visual deltas warn,
// enforced by which projects the visual suite includes, decision F25).
import { defineConfig, devices } from '@playwright/test';

const desktop = { width: 1440, height: 900 };
const wide = { width: 1920, height: 1080 };
// Tablet viewport (820x1180) joins the matrix when the visual suite lands in
// Phase 5; the four-size contract is docs/TEST_PLAN.md section on viewports.
const phone = { width: 390, height: 844 };

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Dedicated port: 4321 is contested by other local dev servers.
    baseURL: 'http://localhost:4741',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'bunx astro preview --port 4741',
    url: 'http://localhost:4741',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'e2e',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Chrome'], viewport: desktop },
    },
    {
      name: 'e2e-webkit',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Safari'], viewport: desktop },
    },
    {
      name: 'e2e-firefox',
      testDir: 'tests/e2e',
      use: { ...devices['Desktop Firefox'], viewport: desktop },
    },
    {
      name: 'e2e-mobile',
      testDir: 'tests/e2e',
      use: { ...devices['iPhone 13'], viewport: phone },
    },
    {
      name: 'a11y',
      testDir: 'tests/a11y',
      use: { ...devices['Desktop Chrome'], viewport: desktop },
    },
    {
      name: 'visual',
      testDir: 'tests/visual',
      use: { ...devices['Desktop Chrome'], viewport: wide },
    },
    {
      name: 'performance',
      testDir: 'tests/performance',
      use: { ...devices['Desktop Chrome'], viewport: desktop },
    },
  ],
});
