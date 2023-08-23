import * as fs from 'fs';
import * as glob from 'glob';
import _ from 'lodash';
import sass from 'sass';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';

export class ExtThemesCommand implements Command {
    public themesPathMask: string[] = [
        'src/styles/prebuild-themes/*.scss',
        this.config.extDir + '/*/styles/prebuild-themes/*.scss',
    ];
    public destPath: string = 'src/assets/themes';

    constructor(private config: Config) {
    }

    public execute(): void {
        console.info('Building custom theme scss files.');

        const files: string[] = _.flatten(_.map(this.themesPathMask, (themePath) => glob.sync(themePath)));
        for (const file of files) {
            const matches = /^_?([a-zA-Z-0-9]+).scss$/.exec(path.basename(file)) || [];
            const name = matches[1];
            const outFile = `${this.destPath}/${name}.css`;

            const res = sass.compile(file, {
                loadPaths: ['src', 'src/styles', this.config.extDir, '.', 'node_modules'],
                sourceMap: false,
            });

            fs.writeFileSync(outFile, res.css);
            console.info(`Building: ${outFile}`);

        }
    }
}
