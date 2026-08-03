#!/usr/bin/env node
const { spawnSync } = require('child_process');

const [, , command, ...cliArgs] = process.argv;

if (!command) {
  console.error('Usage: node scripts/run-node-gyp.js <command> [args...]');
  process.exit(1);
}

const useWindowsCompatFlags = process.platform === 'win32' && ['configure', 'rebuild'].includes(command);
const extraArgs = useWindowsCompatFlags
  ? ['-Denable_lto=0', '-Denable_thin_lto=0', '-Dlto_jobs=0']
  : [];
const nodeGypScript = require.resolve('node-gyp/bin/node-gyp');
const args = [command, ...(extraArgs.length ? ['--', ...extraArgs] : []), ...cliArgs].filter(Boolean);

const result = spawnSync(process.execPath, [nodeGypScript, ...args], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
