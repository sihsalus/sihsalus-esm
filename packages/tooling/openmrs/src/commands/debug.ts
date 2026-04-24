import { spawn } from 'node:child_process';

import type { ImportmapDeclaration } from '../utils';
import { logInfo, rspackBin, shellDir } from '../utils';
import { setShellEnvVars } from '../utils/config';

export interface DebugArgs {
  port: number;
  host: string;
  backend: string;
  importmap: ImportmapDeclaration;
  supportOffline?: boolean;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
  addCookie: string;
}

export function runDebug(args: DebugArgs) {
  setShellEnvVars({
    importmap: args.importmap,
    backend: args.backend,
    apiUrl: args.apiUrl,
    supportOffline: args.supportOffline,
    spaPath: args.spaPath,
    configUrls: args.configUrls,
    addCookie: args.addCookie,
    env: 'development',
  });

  logInfo(`Starting the dev server ...`);

  return new Promise<void>((res, rej) => {
    const ps = spawn(
      process.execPath,
      [rspackBin, 'serve', '--mode', 'development', '--port', String(args.port), '--host', args.host],
      { cwd: shellDir, stdio: 'inherit' },
    );
    ps.on('error', rej);
    // code === null means the process was killed by a signal (e.g. Ctrl+C); treat as clean exit
    ps.on('exit', (code) =>
      code === 0 || code === null ? res() : rej(new Error(`rspack serve exited with code ${code}`)),
    );
  });
}
