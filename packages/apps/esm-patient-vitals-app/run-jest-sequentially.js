const { spawnSync } = require('node:child_process');

const jestBin = require.resolve('jest/bin/jest');
const args = process.argv.slice(2);
const baseArgs = ['--config', 'jest.config.js', '--verbose', 'false', '--passWithNoTests', '--color'];

function runJest(extraArgs, options = {}) {
  return spawnSync(process.execPath, [jestBin, ...baseArgs, ...extraArgs], {
    stdio: options.captureStdout ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    encoding: options.captureStdout ? 'utf8' : undefined,
    env: { ...process.env, TZ: 'UTC' },
  });
}

if (args.length > 0) {
  const result = runJest(args);
  process.exit(result.status ?? 1);
}

const listTestsResult = runJest(['--listTests'], { captureStdout: true });

if (listTestsResult.status !== 0) {
  process.exit(listTestsResult.status ?? 1);
}

const tests = listTestsResult.stdout
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (tests.length === 0) {
  process.exit(0);
}

for (const testFile of tests) {
  const result = runJest(['--runTestsByPath', testFile]);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
