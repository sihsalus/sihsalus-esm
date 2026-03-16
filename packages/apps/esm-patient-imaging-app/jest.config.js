/**
 * @returns {Promise<import('jest').Config>}
 */
const path = require('path');
const { preset } = require('swr/_internal');

module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    '**/src/**/*.component.tsx',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/src/**/*.test.*',
    '!**/src/declarations.d.ts',
    '!**/e2e/**',
  ],
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs|uuid)'],
  moduleNameMapper: {
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '\\.(s?css)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // images
    '^lodash-es/(.*)$': 'lodash/$1',
    'lodash-es': 'lodash',
    '^dexie$': require.resolve('dexie'),
  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  testPathIgnorePatterns: [path.resolve(__dirname, 'e2e')],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
