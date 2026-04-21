const { spawnSync } = require('node:child_process');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../..');
const biomeConfigPath = path.join(repoRoot, 'biome.json');
const [command = 'lint', ...rawArgs] = process.argv.slice(2);
const workspacePath = path.relative(repoRoot, process.cwd());
const args = (rawArgs.length > 0 ? rawArgs : ['.']).map((arg) => {
  if (arg.startsWith('-')) {
    return arg;
  }

  return workspacePath ? path.join(workspacePath, arg) : arg;
});

const result = spawnSync('yarn', ['exec', 'biome', command, '--config-path', biomeConfigPath, ...args], {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
