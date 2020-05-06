const {exec} = require('child_process');
const helpers = require('./helpers');

const EXCLUDE_PATHS = ['src/app/ext', 'src/app/ext-commons'];

getTranslates();

function getTranslates() {
    getCoreTranslates();
    getTranslatesFromExts();
}

function getTranslatesFromExts() {
    const extsPaths = helpers.getDirectories(helpers.EXT_PATH);

    extsPaths.forEach((path) => {
        const extName = `${path.split('/').reverse()[0].split('-')[0]}-ext`;
        const languagesString = helpers.LANGUAGES.join(',');
        const command = `ngx-translate-extract -i ./${path} -o ./${path}/i18n/{${languagesString}}/${extName}.json -f namespaced-json -s`;

        execCommand(command);
    })
}

function getCoreTranslates() {
    const directories = helpers.getDirectories('src/app/*').filter((directory) => !EXCLUDE_PATHS.includes(directory));
    const pathsForExtract = directories.map((directory) => `-i ./${directory}/`);
    const command = `ngx-translate-extract ${pathsForExtract.join(' ')} -o ./src/i18n/{en,ru,uk}/core.json -f namespaced-json -s`;

    execCommand(command);
}

function execCommand(command) {
    exec(command, (err, stdout, stderr) => console.log(err, stdout, stderr));
}
