import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';

export class ExtThemingCommand implements Command {

    public extThemingPathMask: string = this.config.extDir + '/*/*-theming.scss';
    public extThemingDistPath: string = 'src/styles/_theming.scss';

    constructor(private config: Config) {
    }

    public execute(): void {
        const files: string[] = glob.glob(this.extThemingPathMask, { sync: true }, () => undefined) as any;

        const injects: { import: string, include: string, name: string }[] = [];
        for (const file of files) {
            const matches = path.basename(String(file)).match(/^_?([a-zA-Z-0-9]+)-theming.scss$/) || [];
            const name = matches[1];
            const inject = {
                name,
                import: `@import '${name}-webapp-ext/${name}-theming';\n`,
                include: `@include ${name}-theme($theme);\n`,
            };

            injects.push(inject);
        }

        let themeFile: string = fs.readFileSync(this.extThemingDistPath).toString();

        for (const inject of injects) {
            if (!themeFile.includes(inject.import)) {
                themeFile = inject.import + themeFile;
                console.info('Theming is added: ', inject.import);
            }

            if (!themeFile.includes(inject.include)) {
                themeFile = themeFile.replace(/({[\s\S]*?)(})/g, `$1  ${inject.include}$2`);
            }
        }

        fs.writeFileSync(this.extThemingDistPath, themeFile);
    }

}
