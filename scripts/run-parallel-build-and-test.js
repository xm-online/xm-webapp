const {spawn} = require('child_process');
const testCommands = [
    'export http_proxy="http://proxy.itsf.dc:3128"',
    'export https_proxy="http://proxy.itsf.dc:3128"',
    'export HTTP_PROXY=http://proxy.itsf.dc:3128',
    'npm run prebuild',
    'ng test --code-coverage=true --source-map=false --watch=false --browsers ChromeHeadless',
];
const buildCommands = [
    'ls -la',
    'export https_proxy="http://proxy.itsf.dc:3128"',
    'echo "🚀 Determining version from git..."',
    'export IMAGE_TAG=$(git describe --tags --always --dirty)',
    'echo "✅ Version determined: $IMAGE_TAG"',
    'curl -vsS --fail --header "Private-Token: ${gitlab_deploy_token}" --request GET "http://gitlab.dc/api/v4/projects/83/repository/files/gitlab-ci%2Fbuild-update_package_release.sh/raw?ref=ci_k8s" -o  build-update_package_release.sh',
    'chmod +x ./build-update_package_release.sh',
    '/bin/bash ./build-update_package_release.sh',
    'export NODE_OPTIONS="--max_old_space_size=16192"',
    'npm config set proxy http://proxy.itsf.dc:3128',
    'npm config set https-proxy http://proxy.itsf.dc:3128',
    'npm run translations',
    'npm run build:prod',
    'mkdir -p -- "documentation"',
];
;

function runPipeline(name, commands, env) {
    return new Promise((resolve, reject) => {
        const commandString = commands.join(' && ');

        console.log(`\n▶️  [${name}] Starting pipeline...`);

        const proc = spawn(commandString, [], {
            shell: '/bin/bash',
            env: env,
        });
        const addPrefix = (data, isError = false) => {
            const lines = data.toString().split('\n').filter(line => line.length > 0);
            lines.forEach(line => {
                const output = `[${name}] ${line}\n`;
                if (isError) process.stderr.write(output);
                else process.stdout.write(output);
            });
        };

        proc.stdout.on('data', (data) => addPrefix(data));
        proc.stderr.on('data', (data) => addPrefix(data, true));

        proc.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅  [${name}] Pipeline finished successfully.`);
                resolve();
            } else {
                const errorMsg = `\n❌  [${name}] Pipeline failed with exit code ${code}.`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            }
        });

        proc.on('error', (err) => {
            console.error(`\n🚨  [${name}] Error spawning pipeline:`, err);
            reject(err);
        });
    });
}

async function main() {
    console.log("🚀 Starting parallel execution of BUILD and TEST pipelines.");
    const commonEnv = {...process.env};
    if (!commonEnv.gitlab_deploy_token) {
        console.warn('⚠️  Warning: gitlab_deploy_token is not set in the environment!');
    }

    try {
        const testPipeline = runPipeline('TEST', testCommands, commonEnv);
        const buildPipeline = runPipeline('BUILD', buildCommands, commonEnv);

        await Promise.all([testPipeline, buildPipeline]);

        console.log("\n🎉 Both pipelines completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n🔥 One or more pipelines failed.");
        process.exit(1);
    }
}

main();

