import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:8080/openmrs/spa';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 60_000,
  retries: 2,
  workers: 2,
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: BASE_URL,
    storageState: 'e2e/storage-state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet', use: { viewport: { width: 1024, height: 768 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'yarn start',
    url: `${BASE_URL}/login`,
    timeout: 120_000,
    reuseExistingServer: !!process.env.CI,
  },
});
