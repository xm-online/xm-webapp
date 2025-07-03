import { promises as fs } from 'fs';
import { glob as globWithCallback } from 'glob';
import _ from 'lodash';
import { Command } from './command';
import { Config } from './config';

async function readAsJsonAsync(filePath: string): Promise<object> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

async function saveAsJsonAsync(filePath: string, data: object): Promise<void> {
    const content = JSON.stringify(data, null, 2); // Форматируем для читаемости
    await fs.writeFile(filePath, content);
}


function glob(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        globWithCallback(pattern, (err, matches) => {
            if (err) {
                reject(err);
            } else {
                resolve(matches ? matches.map(p => p.replace(/\\/g, '/')) : []);
            }
        });
    });
}

async function getTranslations(pathMask: string): Promise<object> {
    const files = await glob(pathMask);
    if (files.length === 0) {
        return {};
    }
    const translationsArray = await Promise.all(files.map(file => readAsJsonAsync(file)));
    return _.mergeWith({}, ...translationsArray, (a, b) => a || b);
}

export class ExtI18nCommand implements Command {

    public core: string = 'src/i18n/';
    public custom: string = this.config.extDir + '/*/i18n/';

    constructor(private config: Config) {
    }

    public corePathMask = (lang: string): string => `${this.core}${lang}/*.json`;
    public customPathMask = (lang: string): string => `${this.custom}${lang}/*.json`;
    public distPathMask = (lang: string): string => `${this.core}${lang}.json`;

    public async execute(): Promise<void> {
        console.info('Starting i18n processing...');
        try {
            const processingPromises = this.config.locales.map(lang => this.processLanguage(lang));
            await Promise.all(processingPromises);
            console.info('Finished i18n processing for all languages.');
        } catch (error) {
            console.error('A critical error occurred during i18n processing:', error);
        }
    }

    private async processLanguage(lang: string): Promise<void> {
        try {
            await this.moveCustomTranslationsToCoreFolder(this.customPathMask(lang));
            const [coreTranslations, customTranslations] = await Promise.all([
                getTranslations(this.corePathMask(lang)),
                getTranslations(this.customPathMask(lang)),
            ]);

            const savePath = this.distPathMask(lang);
            const mergedTranslates = _.mergeWith({}, coreTranslations, customTranslations);

            await saveAsJsonAsync(savePath, mergedTranslates);
            console.info('Updated:', savePath);
        } catch (error) {
            console.error(`Failed to process language "${lang}":`, error);
        }
    }

    private async moveCustomTranslationsToCoreFolder(pathMask: string): Promise<void> {
        const files = await glob(pathMask);

        const copyPromises = files.map(async (file) => {
            const [fileName, lang] = file.split('/').reverse();
            const dirpath = `${this.core}ext/${lang}`;

            await fs.mkdir(dirpath, {recursive: true});
            await fs.copyFile(file, `${dirpath}/${fileName}`);
        });

        await Promise.all(copyPromises);
    }
}
