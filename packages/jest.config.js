/**
 * @returns {Promise<import('jest').Config>}
 */

const path = require('path');
const sharedTestAliases = require('./tooling/configs/shared-test-aliases.json');

const resolvedSharedTestAliases = Object.fromEntries(
  Object.entries(sharedTestAliases).map(([pattern, relativeTarget]) => [
    pattern,
    path.resolve(__dirname, relativeTarget),
  ]),
);

module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.m?[jt]sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(?:@openmrs|.+\\.pnp\\.[^\\/]+$))'],
  moduleDirectories: ['node_modules', __dirname],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '^@openmrs/esm-api$': path.resolve(__dirname, 'libs', 'esm-api', 'src', 'index.ts'),
    '^@openmrs/esm-api/mock$': path.resolve(__dirname, 'libs', 'esm-api', 'mock-jest.ts'),
    '^@openmrs/esm-api/src/public$': path.resolve(__dirname, 'libs', 'esm-api', 'src', 'public.ts'),
    '^@openmrs/esm-framework$': path.resolve(__dirname, 'tooling', 'scripts', 'esm-framework-jest-mock.tsx'),
    '^@openmrs/esm-expression-evaluator/src/public$': path.resolve(
      __dirname,
      'libs',
      'esm-expression-evaluator',
      'src',
      'public.ts',
    ),
    '^@openmrs/esm-utils$': path.resolve(__dirname, 'libs', 'esm-utils', 'src', 'index.ts'),
    '^@openmrs/esm-utils/mock$': path.resolve(__dirname, 'libs', 'esm-utils', 'mock-jest.ts'),
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
