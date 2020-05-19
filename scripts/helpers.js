const fs = require('fs');
const glob = require('glob');

const LANGUAGES = ['en', 'ru', 'uk'];
const EXT_PATH = 'src/app/ext/*';

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = (source) => glob.sync(source).filter(isDirectory);

const getJsonFile = async (file) => {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            err ? rej(err) : res(data)
        });
    })
};

const writeJsonFile = async (json, file) => {
    return new Promise((res, rej) => {
        fs.writeFile(file, JSON.stringify(json, null, 2), 'utf8', (err) => {
            err ? rej(err) : res();
        });
    })
};

module.exports = {EXT_PATH, LANGUAGES, getDirectories, getJsonFile, writeJsonFile};
