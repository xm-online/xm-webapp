import { promises as fs } from 'fs';
import { glob as globWithCallback } from 'glob';
import _ from 'lodash';
import sass from 'sass';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';

function glob(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        globWithCallback(pattern, (err, matches) => {
            if (err) {
                reject(err);
            } else {
                resolve(matches);
            }
        });
    });
}


export class ExtThemesCommand implements Command {
    public themesPathMask: string[] = [
        'src/styles/prebuild-themes/*.scss',
        this.config.extDir + '/*/styles/prebuild-themes/*.scss',
    ];
    public destPath: string = 'src/assets/themes';

    constructor(private config: Config) {
    }

    public async execute(): Promise<void> {
        console.info('Building custom theme scss files.');

        try {
            const findFilesPromises = this.themesPathMask.map((themePath) => glob(themePath));
            const filesArrays = await Promise.all(findFilesPromises);
            const files: string[] = _.flatten(filesArrays);

            if (files.length === 0) {
                console.info('No theme files found to compile.');
                return;
            }

            await fs.mkdir(this.destPath, {recursive: true});

            const compilationPromises = files.map(async (file) => {
                const matches = /^_?([a-zA-Z-0-9]+).scss$/.exec(path.basename(file)) || [];
                const name = matches[1];

                if (!name) {
                    console.warn(`Could not extract theme name from file: ${file}. Skipping.`);
                    return;
                }

                const outFile = path.join(this.destPath, `${name}.css`);
                const sassOptions = {
                    loadPaths: ['src', 'src/styles', this.config.extDir, '.', 'node_modules'],
                    sourceMap: false,
                };

                try {
                    const result = await sass.compileAsync(file, sassOptions);
                    await fs.writeFile(outFile, result.css);
                    console.info(`Building: ${outFile}`);
                } catch (error) {
                    console.error(`Error building theme from ${file}:`, error);
                }
            });

            await Promise.all(compilationPromises);

            console.info('Finished building all custom themes.');

        } catch (error) {
            console.error('A critical error occurred during the theme building process:', error);
        }
    }
}
