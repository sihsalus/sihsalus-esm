/**
 * @returns {Promise<import('jest').Config>}
 */

const path = require('path');
const sharedTestAliases = require('./tooling/configs/shared-test-aliases.json');

const resolvedSharedTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([pattern, relativeTarget]) => [pattern, path.resolve(__dirname, relativeTarget)]),
);

module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.m?[jt]sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs|.+\\.pnp\\.[^\\/]+$)'],
  moduleDirectories: ['node_modules', __dirname],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '@openmrs/esm-translations': '@openmrs/esm-translations/mock',
    '^dexie$': require.resolve('dexie'),
    '^lodash-es/(.*)$': 'lodash/$1',
    'lodash-es': 'lodash',
    ...resolvedSharedTestAliases,
    '^uuid$': require.resolve('uuid'),
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react-dom/(.*)$': require.resolve('react-dom') + '/../$1',
  },
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/src/**/*.test.*',
    '!**/src/**/*.spec.*',
    '!**/src/**/*.mock.*',
    '!**/src/declarations.d.ts',
    '!**/e2e/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
    './packages/libs/**': {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'tooling', 'scripts', 'setup-tests.ts')],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testTimeout: 25000,
};
