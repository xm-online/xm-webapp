const [nx = ''] = process.argv.slice(2);
const [, isNX = 'false'] = nx.split('=');

const NEW_VERSION_BUILD = process.env.NEW_VERSION_BUILD ?? isNX;

console.info('Running prod build with the following parameters:');
console.table({isNX: NEW_VERSION_BUILD});

const {execSync} = require('child_process');

try {
    execSync('npm run prebuild', {stdio: 'inherit', env: {...process.env, NEW_VERSION_BUILD}});
} catch (error) {
    console.error('Error executing npm run prebuild', error);
    process.exit(1);
}

const command = () => {
    if (NEW_VERSION_BUILD === 'true') {
        return 'nx build xm-webapp --configuration=production --skip-nx-cache';
    }
    return 'ng build --configuration production';

};

try {
    execSync(command(), {stdio: 'inherit'});
} catch (error) {
    console.error('Error executing build:prod', error);
    process.exit(1);
}
