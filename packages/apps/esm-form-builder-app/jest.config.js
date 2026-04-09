const rootConfig = require('../../jest.config.js');

module.exports = {
  ...rootConfig,
  moduleDirectories: [...(rootConfig.moduleDirectories ?? ['node_modules']), '__mocks__', 'src'],
  moduleNameMapper: {
    '^@resources/(.*)$': '<rootDir>/src/resources/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@types$': '<rootDir>/src/types.ts',
    '^@constants$': '<rootDir>/src/constants.ts',
    '^@carbon/icons-react/es/(.*)$': '@carbon/icons-react/lib/$1',
    '^carbon-components-react/es/(.*)$': 'carbon-components-react/lib/$1',
    ...rootConfig.moduleNameMapper,
  },
};
