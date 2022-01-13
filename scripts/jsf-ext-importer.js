const fs = require('fs');
const fse = require('fs-extra');
const {exec} = require('child_process');
const {join} = require('path');
const LOCAL_EXT_PATH = 'src/app/ext';
const LOCAL_ASSETS_PATH = 'src/assets/css/ext/';
const LOCAL_ASSETS_IMG_PATH = 'src/assets/img/ext/';
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(join(p, f)).isDirectory());

const generateImports = [];
dirs(LOCAL_EXT_PATH).forEach(moduleName => {
    const MODULE_PATH = `${LOCAL_EXT_PATH}/${moduleName}/jsf-module/${moduleName}-jsf.module.ts`;
    console.log('Check module path', MODULE_PATH);
    if (fs.existsSync(MODULE_PATH)) {
        const moduleClassName = moduleName.split('-').map(it => capitalizeFirstLetter(it)).join('') + 'JsfModule';
        generateImports[moduleClassName] = `./ext/${moduleName}/jsf-module/${moduleName}-jsf.module`;
    }
});

fs.readFile('src/app/xm-jsf-ext.module.ts', function (err, data) {
    let fileContent = data.toString();
    const generatedModuleImports = Object.keys(generateImports).map(it => ' '.repeat(8) + it).join(',\n');
    const generatedImports = Object.keys(generateImports).map(it => `import { ${it} } from '${generateImports[it]}';`).join('\n');
    const GENERATED_IMPORTS_START = '/* [GENERATED_IMPORTS_START] */';
    const GENERATED_IMPORTS_STOP = '/* [GENERATED_IMPORTS_STOP] */';
    const GENERATED_MODULES_IMPORTS_START = '/* [GENERATED_MODULES_IMPORTS_START] */';
    const GENERATED_MODULES_IMPORTS_STOP = '/* [GENERATED_MODULES_IMPORTS_STOP] */';
    if (generatedModuleImports.length) {
        fileContent = insertBetweenPrefixAndSuffix(
            fileContent,
            GENERATED_MODULES_IMPORTS_START,
            GENERATED_MODULES_IMPORTS_STOP,
            generatedModuleImports,
        );
    }
    if (generatedImports.length) {
        fileContent = insertBetweenPrefixAndSuffix(
            fileContent,
            GENERATED_IMPORTS_START,
            GENERATED_IMPORTS_STOP,
            generatedImports,
        );
    }
    fs.writeFile('src/app/xm-jsf-ext.module.ts', fileContent, () => {
        console.log('Jsf extensions processed!');
    });
});

function insertBetweenPrefixAndSuffix(content, prefix, suffix, stringToInsert) {
    let fileContentPrefix = content.substring(0, content.indexOf(prefix) + prefix.length);
    let fileContentSuffix = content.substring(content.indexOf(suffix));
    return `${fileContentPrefix}\n${stringToInsert}\n${fileContentSuffix}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exec('git update-index --assume-unchanged src/app/xm-jsf-ext.module.ts');
