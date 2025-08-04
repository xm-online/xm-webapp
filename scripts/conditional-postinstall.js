const NEW_VERSION_BUILD = process.env.NEW_VERSION_BUILD ?? true;
const {execSync} = require('child_process');
if (!NEW_VERSION_BUILD) {
    try {
        execSync('npm run build:packages', {stdio: 'inherit'});
    } catch (error) {
        console.error('Error executing build:packages:', error);
        process.exit(1);
    }
} else {
    console.log('xxxxxx NEW_VERSION_BUILD is set, skipping build:packages');
    try {
        execSync('npm run build:nx-packages', {stdio: 'inherit'});
    } catch (error) {
        console.error('Error executing build:packages:', error);
        process.exit(1);
    }
}
