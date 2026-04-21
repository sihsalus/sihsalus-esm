const rootConfig = require('../../jest.config.js');
const { createAppJestConfig } = require('../../tooling/configs/jest-aliases');

module.exports = createAppJestConfig(rootConfig, '<rootDir>', {
  '@mocks/*': '../../test-utils/mocks/*',
  '@tools/test-helpers': '../../test-utils/index.tsx',
});
