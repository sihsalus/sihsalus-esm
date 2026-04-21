const rootConfig = require('../../jest.config.js');
const { aliasPresets, createAppJestConfig } = require('../../tooling/configs/jest-aliases');

module.exports = createAppJestConfig(rootConfig, '<rootDir>', {
  '@hooks/*': 'src/hooks/*',
  '@types': 'src/types.ts',
  '@tools/*': 'tools/*',
  '@constants': 'src/constants.ts',
  '@resources/*': 'src/resources/*',
  ...aliasPresets.sharedWorkspaceTestUtilsAliases,
});
