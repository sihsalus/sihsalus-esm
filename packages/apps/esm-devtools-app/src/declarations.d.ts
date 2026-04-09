import type { ImportMapOverridesApi } from './devtools/import-map-overrides.types';

declare module '*.css' {
	const classes: Record<string, string>;
	export default classes;
}

declare module '*.scss' {
	const classes: Record<string, string>;
	export default classes;
}

declare global {
	interface Window {
		importMapOverrides: ImportMapOverridesApi;
		spaEnv?: string;
	}

	var importMapOverrides: ImportMapOverridesApi;
}

export {};
