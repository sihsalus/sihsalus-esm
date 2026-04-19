import { defineAppE2ESuite } from '../../packages/tooling/configs/playwright-suite';

export default defineAppE2ESuite({
  testDir: './specs',
  globalSetup: require.resolve('./core/global-setup'),
  baseURL: `${process.env.E2E_BASE_URL}/spa/stock-management`,
  storageState: './storageState.json',
  expectTimeout: 40 * 1000,
  fullyParallel: true,
  video: 'retain-on-failure',
});
