import aliasPresets from './alias-presets.json';
type AliasMap = Record<string, string>;
type VitestConfigLike = {
    resolve?: {
        alias?: Array<{
            find: RegExp;
            replacement: string;
        }>;
    };
    test?: Record<string, unknown>;
    [key: string]: unknown;
};
export declare function defineWorkspaceVitestConfig(config?: VitestConfigLike): UserConfig;
export { aliasPresets };
export declare function defineAppVitestConfig(rootDir: string, options?: {
    aliases?: AliasMap;
    extraAliases?: Array<{
        find: RegExp;
        replacement: string;
    }>;
    test?: VitestConfigLike['test'];
}): UserConfig;
//# sourceMappingURL=vitest-config.d.ts.map