const [minimal = '', nx = '', customPort = ''] = process.argv.slice(2);
const [, isNX = 'false'] = nx.split('=');
const [, isMinimal = 'false'] = minimal.split('=');
const [, port = '4200'] = customPort.split('=');

console.info('Running live reload with the following parameters:');
console.table({isNX, isMinimal, port});

const NEW_VERSION_BUILD = process.env.NEW_VERSION_BUILD ?? isNX;
const {execSync} = require('child_process');

try {
    if (isMinimal === 'false') {
        execSync('npm run prebuild', {stdio: 'inherit', env: {...process.env, NEW_VERSION_BUILD}});
    }
} catch (error) {
    console.error('Error executing npm run prebuild', error);
    process.exit(1);
}

const command = () => {
    if (isNX === 'true') {
        return `node --max-old-space-size=12288 ./node_modules/.bin/nx serve xm-webapp --proxy-config local.proxy.conf.js --live-reload --host=0.0.0.0 --port=${port}`;
    }
    return `node --max-old-space-size=12288 ./node_modules/@angular/cli/bin/ng serve --proxy-config local.proxy.conf.js --live-reload --host=0.0.0.0 --port=${port}`;

};

try {
    execSync(command(), {stdio: 'inherit'});
} catch (error) {
    console.error('Error executing build:packages:', error);
    process.exit(1);
}
