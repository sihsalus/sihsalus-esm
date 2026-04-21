import { aliasPresets, defineAppVitestConfig } from '../../tooling/configs/vitest-config';

export default defineAppVitestConfig(__dirname, {
  aliases: aliasPresets.frameworkVitestStubAliases,
  extraAliases: [
    { find: /^lodash-es$/, replacement: aliasPresets.lodashEsAliases['lodash-es'] },
    { find: /^lodash-es\/(.*)$/, replacement: 'lodash/$1' },
  ],
  test: {
    coverage: {
      provider: 'v8',
    },
  },
});
