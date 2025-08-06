// 🛑 CRITICAL WARNING: LOCAL DEVELOPMENT ONLY 🛑
//
// DO NOT COMMIT changes to this file (conditional-postinstall.js).
// This modification is intended EXCLUSIVELY for your local environment.
//
// ---> ALWAYS REVERT THIS FILE TO ITS ORIGINAL STATE BEFORE COMMITTING. <---
// Failure to do so WILL break the build in CI.

const NEW_VERSION_BUILD = process.env.NEW_VERSION_BUILD ?? false;
const IS_CI = process.env.CI;
const {execSync} = require('child_process');
if (NEW_VERSION_BUILD === 'false' || !NEW_VERSION_BUILD) {
    try {
        execSync('npm run build:packages', {stdio: 'inherit'});
    } catch (error) {
        console.error('Error executing build:packages:', error);
        process.exit(1);
    }
} else if (NEW_VERSION_BUILD && !IS_CI) {
    try {
        execSync('npm run build:nx-packages', {stdio: 'inherit'});
    } catch (error) {
        console.error('Error executing build:nx-packages:', error);
        process.exit(1);
    }
}
