const fs = require('fs');
const glob = require('glob');

const WORKSPACE_DEPS = [
  '@openmrs/esm-framework',
  '@openmrs/esm-patient-common-lib',
  '@openmrs/rspack-config',
  'openmrs',
];

const files = glob.sync('packages/**/package.json', { ignore: '**/node_modules/**' });

for (const file of files) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;

  for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (!pkg[depType]) continue;
    for (const name of WORKSPACE_DEPS) {
      if (pkg[depType][name] && pkg[depType][name] !== 'workspace:*') {
        pkg[depType][name] = 'workspace:*';
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated: ${file}`);
  }
}
