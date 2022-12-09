// TODO: migrate to bazel or nx or lerna or alternative
const {execSync} = require('child_process');

execSync('(cd ./packages/cli && npm run build)', {stdio: 'inherit'});
execSync('(cd ./packages/shared && npm run build)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/logger -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/translation -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/styles -c tsconfig.ngc.json)', {stdio: 'inherit'});

try {
    execSync('(ng-packagr -p ./packages/timeline -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/account -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/administration -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/alert -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/confirm-dialog -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/dashboard -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/documentation -c tsconfig.ngc.json)', {stdio: 'inherit'});
    execSync('(ng-packagr -p ./packages/json-schema-form -c tsconfig.ngc.json)', {stdio: 'inherit'});
} catch (err) {
    console.warn('EXPECTED ERROR: COMPLETE MIGRATION TO MODULES AND REMOVE try-catch.', err);
}
