import * as fs from 'fs';
import * as glob from 'glob';
import sass from 'sass';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';

export class ExtThemesCommand implements Command {
    private readonly extDir: string;
    private readonly destPath: string = 'src/assets/themes';
    private readonly themesPathMask: string[];
    private readonly onlyExtThemesPathMask: string[];

    constructor(private config: Config) {
        this.extDir = config.extDir;
        this.themesPathMask = [
            'src/styles/prebuild-themes/*.scss',
            path.join(this.extDir, '*/styles/prebuild-themes/*.scss'),
        ];
        this.onlyExtThemesPathMask = [
            path.join(this.extDir, '*/styles/prebuild-themes/*.scss'),
        ];
    }

    public execute(terminalArgs?: string[]): void {
        console.info('Building custom theme scss files.');

        if (terminalArgs && terminalArgs.length > 0) {
            for (let i = 0; i < terminalArgs.length; i += 2) {
                const [command, value] = [terminalArgs[i], terminalArgs[i + 1]];
                this.buildThemes(command, value);
            }
        } else {
            this.buildThemes();
        }
    }

    private buildThemes(command?: string, value?: string): void {
        const pathMask: string[] = command === '--skipDefaultThemes' ? this.onlyExtThemesPathMask : this.themesPathMask;
        let includeThemes: string[] | undefined;

        if (command === '--include' && value) {
            includeThemes = value.split(',').map(s => s.trim());
        }

        const files = pathMask.flatMap(themePath => glob.sync(themePath));
        const includeFiles = includeThemes
            ? files.filter(file => includeThemes.some(theme => file.includes(theme)))
            : files;

        for (const file of includeFiles) {
            const matches = /^_?([a-zA-Z-0-9]+)\.scss$/.exec(path.basename(file));
            if (!matches) continue;
            const name = matches[1];
            const outFile = path.join(this.destPath, `${name}.css`);

            const res = sass.compile(file, {
                loadPaths: ['src', 'src/styles', this.extDir, '.', 'node_modules'],
                sourceMap: false,
            });

            fs.writeFileSync(outFile, res.css);
            console.info(`Building: ${outFile}`);
        }
    }
}
