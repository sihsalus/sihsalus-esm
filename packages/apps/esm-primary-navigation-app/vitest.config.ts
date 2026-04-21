import path from 'node:path';

import { defineAppVitestConfig } from '../../tooling/configs/vitest-config';

export default defineAppVitestConfig(__dirname, {
  test: {
    root: path.resolve(__dirname),
  },
});
