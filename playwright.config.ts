import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 60_000,
  retries: 2,
  workers: 2,
  use: {
    baseURL: 'http://localhost:8080/openmrs/spa',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet', use: { viewport: { width: 1024, height: 768 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'yarn openmrs develop --backend http://localhost:8080/openmrs --port 9090',
    port: 9090,
    timeout: 120_000,
  },
});
