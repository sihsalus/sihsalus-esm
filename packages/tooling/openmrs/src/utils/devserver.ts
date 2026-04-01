import { fork } from 'child_process';
import { resolve } from 'path';

export function startDevServer(source: string, port: number, cwd = process.cwd()) {
  const runner = resolve(__dirname, 'debugger.js');
  const ps = fork(runner, [], { cwd });

  ps.send({ source, port });

  return ps;
}
