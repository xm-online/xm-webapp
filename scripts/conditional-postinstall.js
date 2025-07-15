if (!process.env.SKIP_POSTINSTALL) {
    const {execSync} = require('child_process');
    try {
        execSync('npm run build:packages', {stdio: 'inherit'});
    } catch (error) {
        console.error('Error executing build:packages:', error);
        process.exit(1);
    }
} else {
    /* eslint-disable no-console */
    console.log('NX_RUN is not set, skipping build:packages');
}
