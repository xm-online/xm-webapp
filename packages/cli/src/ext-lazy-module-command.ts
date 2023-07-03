import _ from 'lodash';
import { Command } from './command';
import { getDirectories } from './fs-utils';
import * as fs from 'fs';
import { ignoreChangedFile } from './git-utils';

export class ExtLazyModuleCommand implements Command {

    public sources: string[] = [
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
        _.forEach(extDirs, (i) => {
            const directory = i.slice(i.lastIndexOf('/'), i.length).replace('/', '');
            const className = directory.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('') + 'Module';
            const path = i.replace('src/app', '.') + `/module/${directory}.module`;
            const selector = directory.replace('-webapp-ext', '');
            const template = this.template(selector, path, className);
            modules.push(template);
            console.info(`Update xm.module.ts selector: "${selector}", lazyModules: "${path}"`);
            /** Backward compatibility: ext- will be removed in the next release. */
            modules.push(this.template('ext-' + selector, path, className));
        });
        return modules.join('');
    }
}
