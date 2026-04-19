import { defineAppVitestConfig } from '../../tooling/configs/vitest-config';

export default defineAppVitestConfig(__dirname, {
  aliases: {
    '@openmrs/esm-framework/src/internal': '../../test-utils/stubs/esm-framework-internal.mock.tsx',
    '@openmrs/esm-framework': '../../test-utils/stubs/esm-framework.mock.tsx',
  },
});
