import * as fs from 'fs';
import * as glob from 'glob';
import * as _ from 'lodash';
import { Command } from './command';
import { Config } from './config';
import { readAsJson, saveAsJson } from './fs-utils';

function getTranslations(pathMask: string): object {
    let translations = {};

    glob.sync(pathMask).forEach(file => {
        translations = _.merge(translations, readAsJson(file));
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
            saveAsJson(savePath, _.mergeWith({}, coreTranslations, customTranslations, (a, b) => {
                return (b === null || b === '') ? a : undefined;
            }));
            console.info('Updated: ', savePath);
        });
    }

    private moveCustomTranslationsToCoreFolder(pathMask: string): void {
        glob.sync(pathMask).forEach(file => {
            const [fileName, lang] = file.split('/').reverse();
            const dirpath = `${this.core}ext/${lang}`;
            fs.mkdirSync(dirpath, { recursive: true });

            fs.copyFile(file, `${dirpath}/${fileName}`, (err) => {
                if (err) throw err;
            });
        });
    }

}

