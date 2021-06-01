// TODO: migrate to bazel or alternative
const {execSync} = require('child_process');

execSync('(cd ./packages/cli && npm run build)', {stdio: 'inherit'});
execSync('(cd ./packages/shared && npm run build)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)', {stdio: 'inherit'});
execSync('(ng-packagr -p ./packages/translation -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)', true)
