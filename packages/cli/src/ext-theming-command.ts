import { promises as fs } from 'fs';
import { glob as globWithCallback } from 'glob';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';
import { ignoreChangedFile } from './git-utils';

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

export class ExtThemingCommand implements Command {

    public extThemingPathMask: string = this.config.extDir + '/*/styles/*-theming.scss';
    public extThemingDistPath: string = 'src/styles/_theming.scss';

    constructor(private config: Config) {
    }

    public async execute(): Promise<void> {
        console.info('Starting theming processing...');
        try {
            const files: string[] = await glob(this.extThemingPathMask);

            if (files.length === 0) {
                console.info('No theming files found to process.');
                return;
            }

            const injects: { import: string, include: string, name: string }[] = [];
            for (const file of files) {
                const matches: string[] = /^_?([a-zA-Z-0-9]+)-theming.scss$/.exec(path.basename(file)) || [];
                const name = matches[1];
                if (!name) {
                    console.warn('Skip file: ', path.basename(file));
                    continue;
                }
                const inject = {
                    name,
                    import: `@import '${name}-webapp-ext/styles/_${name}-theming';\n`,
                    include: `@include ${name}-theme($theme);\n`,
                };

                injects.push(inject);
            }

            let themeFile: string = await fs.readFile(this.extThemingDistPath, 'utf-8');

            for (const inject of injects) {
                if (!themeFile.includes(inject.import)) {
                    themeFile = inject.import + themeFile;
                    console.info('Theming is added:', inject.name);
                }

                if (!themeFile.includes(inject.include)) {
                    themeFile = themeFile.replace(/({[\s\S]*?)(})/g, `$1  ${inject.include}$2`);
                }
            }

            await fs.writeFile(this.extThemingDistPath, themeFile);
            await ignoreChangedFile(this.extThemingDistPath);

            console.info('Finished theming processing.');

        } catch (error) {
            console.error('A critical error occurred during theming processing:', error);
        }
    }
}
