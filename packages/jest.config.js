/**
 * @returns {Promise<import('jest').Config>}
 */

const path = require('path');

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
    '^react-i18next$': path.resolve(__dirname, '__mocks__', 'react-i18next.js'),
    '^uuid$': require.resolve('uuid'),
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react-dom/(.*)$': require.resolve('react-dom') + '/../$1',
  },
  collectCoverageFrom: [
    '**/src/**/*.component.tsx',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/src/**/*.test.*',
    '!**/src/declarations.d.ts',
    '!**/e2e/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'tooling', 'setup-tests.ts')],
  testPathIgnorePatterns: [path.resolve(__dirname, 'e2e')],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testTimeout: 25000,
};
