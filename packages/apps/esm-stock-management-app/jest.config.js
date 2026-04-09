const path = require('path');
const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleNameMapper: {
    ...rootConfig.moduleNameMapper,
    '^@mocks$': path.resolve(__dirname, '__mocks__'),
    '^@mocks/(.*)$': path.resolve(__dirname, '__mocks__', '$1'),
  },
};
