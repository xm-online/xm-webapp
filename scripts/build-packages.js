// TODO: migrate to bazel or alternative
const { spawn } = require('child_process');

function execute(cmd) {
    const ls = spawn(cmd, { shell: true });
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}

execute('(cd ./packages/cli && npm run build)');
execute('(cd ./packages/shared && npm run build)');
execute('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)');
execute('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)');
execute('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)');
execute('(ng-packagr -p ./packages/translation -c tsconfig.ngc.json)');
