const child_process = require('child_process');
// TODO: migrate to bazel or alternative
child_process.exec('ng-packagr -p ./packages/shared -c tsconfig.ngc.json');
child_process.exec('ng-packagr -p ./packages/core -c tsconfig.ngc.json');
