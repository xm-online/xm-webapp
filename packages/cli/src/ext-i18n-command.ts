import * as fs from 'fs';
import * as glob from 'glob';
import _ from 'lodash';
import { Command } from './command';
import { Config } from './config';
import { readAsJson, saveAsJson } from './fs-utils';

function getTranslations(pathMask: string): object {
    let translations = {};

    glob.sync(pathMask).map(filePath => filePath.replace(/\\/g, '/')).forEach(file => {
        const newTranslations = readAsJson(file);
        translations = _.mergeWith(translations, newTranslations, (a, b) => a || b);
    });

    return translations;
}

export class ExtI18nCommand implements Command {

    public core: string = 'src/i18n/';
    public custom: string = this.config.extDir + '/*/i18n/';

    constructor(private config: Config) {
    }

    public corePathMask: (lang: string) => string = (lang: string): string => this.core + lang + '/*.json';

    public customPathMask: (lang: string) => string = (lang: string): string => this.custom + lang + '/*.json';

    public distPathMask: (lang: string) => string = (lang: string): string => this.core + lang + '.json';

    public execute(): void {
        this.config.locales.forEach(lang => {
            this.moveCustomTranslationsToCoreFolder(this.customPathMask(lang));

            const coreTranslations = getTranslations(this.corePathMask(lang));
            const customTranslations = getTranslations(this.customPathMask(lang));

            const savePath = this.distPathMask(lang);
            const mergedTranslates = _.mergeWith({}, coreTranslations, customTranslations, (a, b) => a || b);
            saveAsJson(savePath, mergedTranslates);
            console.info('Updated: ', savePath);
        });
    }

    private moveCustomTranslationsToCoreFolder(pathMask: string): void {
        glob.sync(pathMask).map(filePath => filePath.replace(/\\/g, '/')).forEach(file => {
            const [fileName, lang] = file.split('/').reverse();
            const dirpath = `${this.core}ext/${lang}`;
            fs.mkdirSync(dirpath, { recursive: true });

            fs.copyFile(file, `${dirpath}/${fileName}`, (err) => {
                if (err) throw err;
            });
        });
    }

}

