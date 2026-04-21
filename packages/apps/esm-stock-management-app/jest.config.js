const path = require('path');
const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@mocks$': path.resolve(__dirname, 'test-utils/mocks'),
    '^@mocks/(.*)$': path.resolve(__dirname, 'test-utils/mocks', '$1'),
    '^@tools$': path.resolve(__dirname, 'tools'),
    '^@tools/(.*)$': path.resolve(__dirname, 'tools', '$1'),
  },
};
