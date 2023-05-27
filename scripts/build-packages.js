// TODO: Migrate to bazel or nx or lerna or angular workspace or alternative
const {execSync} = require('child_process');

execSync('(cd ./packages/cli && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/styles && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/interfaces && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/exceptions && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/pipes && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/validators && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/operators && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/eslint-plugin && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/repositories && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/core && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/dynamic && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/logger && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/translation && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/toaster && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/alert && npm run build && cd ../../)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/confirm-dialog -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(cd ./packages/entity && npm run build && cd ../../)', {stdio: 'inherit'});

// execSync('(ng-packagr -p ./packages/json-schema-form -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(cd ./packages/shared && npm run build)', {stdio: 'inherit'});
// execSync('(cd ./packages/balance && npm run build && cd ../../)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/timeline -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/account -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/administration -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/dashboard -c tsconfig.ngc.json)', {stdio: 'inherit'});
// execSync('(ng-packagr -p ./packages/documentation -c tsconfig.ngc.json)', {stdio: 'inherit'});

execSync('(cd ./src/app/ext/example-webapp-ext && npm run build && cd ../../../../)', {stdio: 'inherit'});

// TODO:WORKAROUND fixing bin folder adding.
execSync('(npm i --ignore-scripts)', {stdio: 'inherit'});
