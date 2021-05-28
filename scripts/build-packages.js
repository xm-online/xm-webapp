// TODO: migrate to bazel or alternative
const {spawn} = require('child_process');

function execute(cmd, allowFailure = false) {
    const ls = spawn(cmd, {shell: true});
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0 && allowFailure === false) {
            process.exit(1);
        }
    });

}

execute('(cd ./packages/cli && npm run build)', false);
execute('(cd ./packages/shared && npm run build)', false);
execute('(ng-packagr -p ./packages/dynamic -c tsconfig.ngc.json)', false);
execute('(ng-packagr -p ./packages/core -c tsconfig.ngc.json)', true);
execute('(ng-packagr -p ./packages/components -c tsconfig.ngc.json)', true);
execute('(ng-packagr -p ./packages/translation -c tsconfig.ngc.json)', true);
