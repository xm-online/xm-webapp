import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';
import { ignoreChangedFile } from './git-utils';

export class ExtThemingCommand implements Command {

    public extThemingPathMask: string = this.config.extDir + '/*/styles/*-theming.scss';
    public extThemingDistPath: string = 'src/styles/_theming.scss';

    constructor(private config: Config) {
    }

    public execute(): void {
        const files: string[] = glob.sync(this.extThemingPathMask, { sync: true });

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

        let themeFile: string = fs.readFileSync(this.extThemingDistPath).toString();

        for (const inject of injects) {
            if (!themeFile.includes(inject.import)) {
                themeFile = inject.import + themeFile;
                console.info('Theming is added:', inject.name);
            }

            if (!themeFile.includes(inject.include)) {
                themeFile = themeFile.replace(/({[\s\S]*?)(})/g, `$1  ${inject.include}$2`);
            }
        }

        fs.writeFileSync(this.extThemingDistPath, themeFile);
        ignoreChangedFile(this.extThemingDistPath);
    }

}
