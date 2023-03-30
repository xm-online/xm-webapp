// TODO: Migrate to bazel or nx or lerna or angular workspace or alternative
const { execSync } = require('child_process');
const fs = require('fs');

async function updateNamespace() {
  try {
    const data = await fs.promises.readFile('node_modules/preact/compat/src/index.d.ts', 'utf8');
    const updatedData = data.replace(/React/g, 'React2');
    await fs.promises.writeFile('node_modules/preact/compat/src/index.d.ts', updatedData, 'utf8');
    console.log('Namespace name successfully updated.');
  } catch (err) {
    console.error('Error reading or writing the file:', err);
  }
}

async function main() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await updateNamespace();
  execSync('(cd ./packages/cli && npm run build)', { stdio: 'inherit' });
}

main();
// TODO: Complete migration to modules.
// execSync('(cd ./packages/shared && npm run build)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/styles -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/translation -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/balance -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/entity -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/logger -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/timeline -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/account -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/administration -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/alert -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/confirm-dialog -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/dashboard -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/documentation -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/json-schema-form -c tsconfig.ngc.json)', {stdio: 'inherit'});

