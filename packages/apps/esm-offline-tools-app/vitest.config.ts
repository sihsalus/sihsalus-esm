import { defineAppVitestConfig } from '../../tooling/configs/vitest-config';

export default defineAppVitestConfig(__dirname, {
  aliases: {
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
  },
});
