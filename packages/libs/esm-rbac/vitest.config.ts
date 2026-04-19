import { defineWorkspaceVitestConfig } from '../../tooling/configs/vitest-config';

export default defineWorkspaceVitestConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        branches: 80,
      },
    },
  },
});
