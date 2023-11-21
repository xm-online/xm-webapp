// TODO: Migrate to bazel or nx or lerna or angular workspace or alternative
const {execSync} = require('child_process');

execSync('(cd ./packages/cli && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/eslint-plugin && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/styles && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/interfaces && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/exceptions && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/pipes && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/validators && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/operators && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/repositories && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/core && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/dynamic && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/logger && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/translation && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/toaster && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/alert && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/error-messages && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/controllers && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/components && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/json-schema-form && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/shared && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/entity && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/balance && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/timeline && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/account && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/dashboard && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/administration && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/common-webapp-ext && npm run build && cd ../../)', {stdio: 'inherit'});
execSync('(cd ./packages/common-entity-webapp-ext && npm run build && cd ../../)', {stdio: 'inherit'});

// TODO:WORKAROUND next release
// execSync('(cd ./src/app/ext/example-webapp-ext && npm run build && cd ../../../../)', {stdio: 'inherit'});
