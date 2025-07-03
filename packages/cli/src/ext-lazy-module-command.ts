import { promises as fs } from 'fs';
import _ from 'lodash';
import { Project } from 'ts-morph';
import { Command } from './command';
import { getDirectories } from './fs-utils';
import { ignoreChangedFile } from './git-utils';
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

    public async getAllDirectories(): Promise<string[]> {
        const directoryPromises = this.sources.map(source => getDirectories(source));
        const listOfLists = await Promise.all(directoryPromises);
        return _.flatten(listOfLists);
    }

    public async execute(): Promise<void> {
        console.info('Updating lazy-loaded extension modules...');
        try {
            const moduleFileUrl = 'src/app/xm.module.ts';

            const moduleSource = await fs.readFile(moduleFileUrl, 'utf-8');

            const matcher = /(#regionstart dynamic-extension-modules\s)([\s\S]*)( {12}\/\/ #regionend dynamic-extension-modules)/;

            const lazyModules = await this.updateAngularJsonLazyModules();
            const newSource = moduleSource.replace(matcher, `$1${lazyModules}$3`);

            await fs.writeFile(moduleFileUrl, newSource);
            await ignoreChangedFile(moduleFileUrl);

            console.info('Successfully updated and staged xm.module.ts.');
        } catch (error) {
            console.error('Failed to update lazy-loaded modules:', error);
        }
    }

    public async addXmGeneralModules(modules: string[]): Promise<void> {
        await new Promise<void>((resolve) => {
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
                        const file = component.getSourceFile();
                        const path = file.getFilePath();
                        if (path.includes('src/app/ext')) {
                            let modulePath = path.substring(path.indexOf('src/app/ext'));
                            modulePath = modulePath.substring(0, modulePath.lastIndexOf('/module'));
                            this.moduleByPath(modulePath, modules, 'xm-general');
                        }
                    }
                }
            }
            resolve();
        });
    }

    public async updateAngularJsonLazyModules(): Promise<string> {
        const extDirs = await this.getAllDirectories();
        const modules: string[] = [];
        _.forEach(extDirs, (i) => {
            this.moduleByPath(i, modules);
        });
        await this.addXmGeneralModules(modules);
        return modules.join('');
    }

    private moduleByPath(i: string, modules: string[], moduleSelector: string = null): void {
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
