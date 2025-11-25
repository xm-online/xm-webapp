import _ from 'lodash';
import { Command } from './command';
import { getDirectories } from './fs-utils';
import * as fs from 'fs';
import { ignoreChangedFile } from './git-utils';
import { Project } from 'ts-morph';
import { getSelectorValue } from './selector-util';

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
        const packageLockFileUrl = 'package-lock.json';
        const projectFileUrl = 'project.json';
        const conditionaPostinstallFileUrl = 'scripts/conditional-postinstall.js';
        fs.writeFileSync(moduleFileUrl, newSource);
        ignoreChangedFile(moduleFileUrl);
        ignoreChangedFile(packageLockFileUrl);
        ignoreChangedFile(projectFileUrl);
        ignoreChangedFile(conditionaPostinstallFileUrl);
    }

    public addXmGeneralModules(modules: string[]): void {
        const project = new Project({
            tsConfigFilePath: 'tsconfig.json',
        });

        const sourceFiles = project.getSourceFiles();
        for (const sourceFile of sourceFiles) {
            const components = sourceFile.getClasses()
                .filter(i => !!i.getDecorator('Component'));
            for (const component of components) {
                const selector = getSelectorValue(component);
                if (selector?.startsWith('xm-general/')) {
                    const module = selector.split('/')[0];
                    const file = component.getSourceFile();
                    const path = file.getFilePath();
                    if (module && path.indexOf('src/app/ext') > 0) {
                        let modulePath = path.substring(path.indexOf('src/app/ext'));
                        modulePath = modulePath.substring(0, modulePath.lastIndexOf('/module'));
                        this.moduleByPath(modulePath, modules, 'xm-general');
                    }
                }
            }
        }
    }

    public updateAngularJsonLazyModules(): string {
        const extDirs = this.getAllDirectories();
        const modules: string[] = [];
        _.forEach(extDirs, (i) => {
            this.moduleByPath(i, modules);
        });
        this.addXmGeneralModules(modules);
        return modules.join('');
    }

    private moduleByPath(i: string, modules: string[], moduleSelector: string = null) {
        const directory = i.slice(i.lastIndexOf('/'), i.length).replace('/', '');
        const selector = moduleSelector ? moduleSelector : directory.replace('-webapp-ext', '');
        const className = directory.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('') + 'Module';
        const path = i.replace('src/app', '.') + `/module/${directory}.module`;
        modules.push(this.template(selector, path, className));
        console.info(`Update xm.module.ts selector: "${selector}", lazyModules: "${path}"`);
        /** Backward compatibility: ext- will be removed in the next release. */
        modules.push(this.template('ext-' + selector, path, className));
    }
}
