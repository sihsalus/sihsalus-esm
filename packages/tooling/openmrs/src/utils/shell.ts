import { resolve } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const getShellDir = () => resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..');

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const getRspackBin = () => resolve(require.resolve('@rspack/cli/package.json'), '..', 'bin', 'rspack.js');
