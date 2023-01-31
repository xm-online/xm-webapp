import * as _ from 'lodash';
import { Command } from './command';
import { getDirectories, isFile } from './fs-utils';
import * as fs from 'fs';
import { ignoreChangedFile } from './git-utils';

export class ExtLazyModuleCommand implements Command {

    public sources: string[] = [
        'packages/*',
        'src/app/ext-commons/*',
        'src/app/ext/*',
    ];

    public template = (selector: string, file: string, module: string): string => `            {
                selector: '${selector}',
                loadChildren: () => import('${file}').then(m => m.${module}),
            },
`;

    public getAllDirectories(): string[] {
        const list = [];
        for (const source of this.sources) {
            const extDirs = getDirectories(source);
            list.push(...extDirs);
        }
        return list;
    }

    public execute(): void {
        const moduleSource = String(fs.readFileSync('src/app/xm.module.ts'));
        const matcher = /(#regionstart dynamic-extension-modules\s)([\s\S]*)( {12}\/\/ #regionend dynamic-extension-modules)/;
        const lazyModules = this.updateAngularJsonLazyModules();
        const newSource = moduleSource.replace(matcher, '$1' + lazyModules + '$3');
        const moduleFileUrl = 'src/app/xm.module.ts';
        fs.writeFileSync(moduleFileUrl, newSource);
        ignoreChangedFile(moduleFileUrl);
    }

    public updateAngularJsonLazyModules(): string {
        const extDirs = this.getAllDirectories();
        const modules: string[] = [];
        _.forEach(extDirs, (directoryPath) => {
            const directoryName = directoryPath.slice(directoryPath.lastIndexOf('/'), directoryPath.length).replace('/', '');
            const className = directoryName.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('') + 'Module';
            const modulePath = directoryPath + `/module/${directoryName}.module`;

            if (!isFile(modulePath + '.ts')) {
                return;
            }

            let selector = directoryName.replace('-webapp-ext', '');

            // TODO:WORKAROUND: resolve company name, after migration to packages change to import by path
            if (directoryPath.startsWith('packages/')) {
                selector = '@xm-ngx/' + selector;
            }

            const template = this.template(selector, modulePath, className);
            modules.push(template);
            console.info(`Update xm.module.ts selector: "${selector}", lazyModules: "${modulePath}", className: "${className}"`);

            if (!directoryPath.startsWith('packages/')) {
                /** Backward compatibility: ext- will be removed in the next release. */
                modules.push(this.template('ext-' + selector, modulePath, className));
            }
        });
        return modules.join('');
    }
}
