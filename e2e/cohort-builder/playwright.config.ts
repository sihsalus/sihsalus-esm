import { defineAppE2ESuite } from '../../packages/tooling/configs/playwright-suite';

export default defineAppE2ESuite({
  testDir: './specs',
  globalSetup: require.resolve('./core/global-setup'),
  baseURL: `${process.env.E2E_BASE_URL}/spa/`,
  storageState: './storageState.json',
  expectTimeout: 40 * 1000,
  fullyParallel: true,
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
});
