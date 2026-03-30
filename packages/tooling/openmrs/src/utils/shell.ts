import { resolve } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const shellDir = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..');

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const rspackBin = resolve(require.resolve('@rspack/cli/package.json'), '..', 'bin', 'rspack.js');
