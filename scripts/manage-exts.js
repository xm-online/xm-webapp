const fs = require('fs');
const fse = require('fs-extra');
const { exec } = require("child_process");
const {join} = require('path');
const LOCAL_EXT_PATH = 'src/app/ext';
const LOCAL_ASSETS_PATH = 'src/assets/css/ext/';
const LOCAL_ASSETS_IMG_PATH = 'src/assets/img/ext/';
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(join(p, f)).isDirectory());

const generateImports = [];
dirs(LOCAL_EXT_PATH).forEach(moduleName => {
    const MODULE_PATH = `${LOCAL_EXT_PATH}/${moduleName}/jsf-module/${moduleName}-jsf.module.ts`;
    if (fs.existsSync(MODULE_PATH)) {
        const moduleClassName = moduleName.split('-').map(it => capitalizeFirstLetter(it)).join('') + 'JsfModule';
        generateImports[moduleClassName] = `./ext/${moduleName}/jsf-module/${moduleName}-jsf.module`;
    }
})

fs.readFile('src/app/xm-jsf-ext.module.ts', function (err, data) {
    let fileContent = data.toString();
    const generatedModuleImports = Object.keys(generateImports).map(it => ' '.repeat(8) + it).join(',\n');
    const generatedImports = Object.keys(generateImports).map(it => `import { ${it} } from '${generateImports[it]}';`).join('\n');
    const GENERATED_IMPORTS_START = '/* [GENERATED_IMPORTS_START] */';
    const GENERATED_IMPORTS_STOP = '/* [GENERATED_IMPORTS_STOP] */';
    const GENERATED_MODULES_IMPORTS_START = '/* [GENERATED_MODULES_IMPORTS_START] */';
    const GENERATED_MODULES_IMPORTS_STOP = '/* [GENERATED_MODULES_IMPORTS_STOP] */';

    fileContent = insertBetweenPrefixAndSuffix(
        fileContent,
        GENERATED_MODULES_IMPORTS_START,
        GENERATED_MODULES_IMPORTS_STOP,
        generatedModuleImports
    );
    fileContent = insertBetweenPrefixAndSuffix(
        fileContent,
        GENERATED_IMPORTS_START,
        GENERATED_IMPORTS_STOP,
        generatedImports
    );
    fs.writeFile('src/app/xm-jsf-ext.module.ts', fileContent, () => {
        console.log('Jsf extensions processed!')
    });
});

function insertBetweenPrefixAndSuffix(content, prefix, suffix, stringToInsert) {
    let fileContentPrefix = content.substring(0, content.indexOf(prefix) + prefix.length)
    let fileContentSuffix = content.substring(content.indexOf(suffix))
    return `${fileContentPrefix}\n${stringToInsert}\n${fileContentSuffix}`;
}

fs.readFile('config.angular.json', function (err, data) {
    let json = JSON.parse(data);
    const KEY_LAZY = 'lazyModules';
    const LAZY_ARRAY = dirs(LOCAL_EXT_PATH).map(p => {
        const CSS_ASSET = `${LOCAL_EXT_PATH}/${p}/assets/css/`;
        const IMG_ASSET = `${LOCAL_EXT_PATH}/${p}/assets/img/`;
        if (fs.existsSync(CSS_ASSET)) {
            fse.copy(CSS_ASSET, LOCAL_ASSETS_PATH, function (err) {
                if (err) {
                    return console.error(err)
                }
            });
        }
        if (fs.existsSync(IMG_ASSET)) {
            fse.copy(IMG_ASSET, LOCAL_ASSETS_IMG_PATH, function (err) {
                if (err) {
                    return console.error(err)
                }
            });
        }
        return LOCAL_EXT_PATH + '/' + p + '/module/' + p + '.module';
    });
    const CURRENT_LAZY_ARRAY = json['projects']['xm-webapp']['architect']['build']['options'][KEY_LAZY];
    LAZY_ARRAY.map(l => CURRENT_LAZY_ARRAY.push(l));
    json['projects']['xm-webapp']['architect']['build']['options'][KEY_LAZY] = CURRENT_LAZY_ARRAY;
    fs.writeFile('angular.json', JSON.stringify(json, null, 4), () => {
        console.log('Extensions processed!')
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exec('git update-index --assume-unchanged src/app/xm-jsf-ext.module.ts')
