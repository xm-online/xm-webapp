// TODO: migrate to bazel or alternative
const child_process = require('child_process');
child_process.exec('(cd ./packages/cli && npm run build)');
child_process.exec('(cd ./packages/shared && npm run build)');
child_process.exec('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)');
child_process.exec('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)');
child_process.exec('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)');
