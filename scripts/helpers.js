const fs = require('fs');
const glob = require('glob');

const LANGUAGES = ['en', 'ru', 'uk', 'de', 'it'];
const EXT_PATH = 'src/app/ext/*';

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = (source) => glob.sync(source).map(filePath => filePath.replace(/\\/g, '/')).filter(isDirectory);

const getJsonFile = async (file) => {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            err ? rej(err) : res(data)
        });
    })
};

const writeJsonFile = async (json, file) => {
    return new Promise((res, rej) => {
        fs.writeFile(file, JSON.stringify(json, null, 2) + '\r\n', 'utf8', (err) => {
            err ? rej(err) : res();
        });
    })
};

module.exports = {EXT_PATH, LANGUAGES, getDirectories, getJsonFile, writeJsonFile};
