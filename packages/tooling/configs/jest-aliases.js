const aliasPresets = require('./alias-presets.json');

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/').replace(/\/\.\//g, '/');
}

function createJestAliasMap(rootDir, aliases) {
  return Object.fromEntries(
    Object.entries(aliases).map(([key, relativeTarget]) => {
      const pattern = key.endsWith('/*') ? `^${key.slice(0, -2)}/(.*)$` : `^${key}$`;
      const target = relativeTarget.endsWith('/*')
        ? `${toPosix(`${rootDir}/${relativeTarget.slice(0, -2)}`)}/$1`
        : toPosix(`${rootDir}/${relativeTarget}`);

      return [pattern, target];
    }),
  );
}

function createAppJestConfig(rootConfig, rootDir, aliases = {}) {
  return {
    ...rootConfig,
    moduleNameMapper: {
      ...rootConfig.moduleNameMapper,
      ...createJestAliasMap(rootDir, aliases),
    },
  };
}

module.exports = {
  aliasPresets,
  createAppJestConfig,
  createJestAliasMap,
};
