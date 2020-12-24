import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Command } from './command';
import { Config } from './config';

export class ExtRoutingCommand implements Command {

    public extRoutingPathMask: string = this.config.extDir + '/*/*-routes.ts';
    public extRoutingDistPath: string = 'src/app/xm-routing.module.ts';

    constructor(private config: Config) {
    }

    public execute(): void {
        const files: string[] = glob.sync(this.extRoutingPathMask, { sync: true });

        const injects: { import: string, include: string, name: string }[] = [];
        for (const file of files) {
            const matches: string[] = /^([a-zA-Z-0-9]+)-routing.ts$/.exec(path.basename(file)) || [];
            const name = matches[1];
            if (!name) {
                console.warn('Skip file: ', path.basename(file));
                continue;
            }
            const inject = {
                name,
                import: `import { ${name.toUpperCase()}_ROUTES } from '@xm-ngx/ext/${name}-webapp-ext/${name}-routing';\n`,
                include: `...${name.toUpperCase()}_ROUTES,\n`,
            };

            injects.push(inject);
        }

        let themeFile: string = fs.readFileSync(this.extRoutingDistPath).toString();

        for (const inject of injects) {
            if (!themeFile.includes(inject.import)) {
                themeFile = inject.import + themeFile;
                console.info('Routing is added: ', inject.import);
            }

            if (!themeFile.includes(inject.include)) {
                themeFile = themeFile.replace(/({[\s\S]*?)(})/g, `$1  ${inject.include}$2`);
            }
        }

        fs.writeFileSync(this.extRoutingDistPath, themeFile);
    }
}
