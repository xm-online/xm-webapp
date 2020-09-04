const fs = require('fs');

const TARGET_THEME = 'src/styles/_theme.scss';
const TARGET_STYLES = 'src/styles.scss';
const TARGET_WEBMANIFEST = 'src/manifest.webmanifest';

const terminalArgs = process.argv.slice(2);

function replaceFile(sourcePath, targetPath) {
    const source = fs.readFileSync(sourcePath);
    fs.writeFileSync(targetPath, source);
    console.info(`Finished, ${targetPath} was successfully updated.`);
}

function replace(command, value) {
    switch (command) {
        case 'theme':
            replaceFile(value, TARGET_THEME);
            break;
        case 'styles':
            replaceFile(value, TARGET_STYLES);
            break;
        case 'webmanifest':
            replaceFile(value, TARGET_WEBMANIFEST);
            break;
        default:
            console.warn(`Sorry, the argument ${command} is unknown command.`);
    }
}

for (let i = 0; i < terminalArgs.length; i += 2) {
    const command = terminalArgs[i];
    const value = terminalArgs[i + 1];
    replace(command, value);
}
