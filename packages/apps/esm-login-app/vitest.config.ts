import { aliasPresets, defineAppVitestConfig } from '../../tooling/configs/vitest-config';

export default defineAppVitestConfig(__dirname, {
  aliases: aliasPresets.frameworkVitestStubAliases,
});
