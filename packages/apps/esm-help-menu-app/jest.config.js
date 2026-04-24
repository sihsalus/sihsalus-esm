const baseConfig = require('../../jest.config.js');

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [...baseConfig.setupFilesAfterEnv, '<rootDir>/setup-tests.ts'],
};
