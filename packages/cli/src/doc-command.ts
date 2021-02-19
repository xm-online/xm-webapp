import fs from 'fs';
import * as glob from 'glob';
import * as _ from 'lodash';
import path from 'path';
import { Command } from './command';

/** @experimental */
export interface DocExample {
    filepath: string,
    moduleName: string,
    selector: string,
    content: string,
    exampleDocHtml: string,
    exampleDocTs: string,
    exampleDocExample?: string,
}

/** @experimental */
export class DocCommand implements Command {
    private examplesModulePathMask: string[] = [
        'src/**/examples/*module.ts',
        'packages/**/examples/*module.ts',
    ];
    private examplesModulePath: string = 'packages/documentation/doc-examples/xm-doc-examples.module.ts';
    private examplesComponentPath: string = 'packages/documentation/doc-examples/xm-doc-examples.ts';
    private examplesComponentHtmlPath: string = 'packages/documentation/doc-examples/xm-doc-examples.component.html';

    public execute(): void {
        const examples: DocExample[] = this.getExamples();
        this.updateModuleFile(examples);
        this.updateDataFile(examples);
        this.updateComponentFile(examples);
    }

    private getExamples(): DocExample[] {
        const modulesPath: string[] = _.flatten(_.map(this.examplesModulePathMask, (themePath) => glob.sync(themePath, { sync: true })));

        const examples: DocExample[] = [];
        for (const modulePath of modulesPath) {
            const modulePathMatches: string[] = /([a-z-]+).module.ts$/.exec(path.basename(modulePath)) || [];
            const moduleSelectorName = modulePathMatches[1];
            if (!moduleSelectorName) {
                console.warn('Skip file: ', path.basename(modulePath));
                continue;
            }
            const modulePrefix = _.startCase(moduleSelectorName).replace(/\s/g, '');
            const moduleName = `${modulePrefix}Module`;


            // Get all examples inside the module
            const componentsPathMask = path.join(path.dirname(modulePath), '/**/*.component.*');
            const componentsPath: string[] = glob.sync(componentsPathMask, { sync: true });
            const filenames: string[] = _.map(componentsPath, (c) => (/([a-z-]+).component.ts$/.exec(path.basename(c)) || [])[1]);
            const uniqueComponentNames: string[] = _.compact(filenames);
            for (const uniqueComponentName of uniqueComponentNames) {

                const html = uniqueComponentName + '.component.html';
                const ts = uniqueComponentName + '.component.ts';
                const htmlFilePath = _.find(componentsPath, (path) => path.includes(html));
                const tsFilePath = _.find(componentsPath, (path) => path.includes(ts));

                examples.push({
                    exampleDocHtml: htmlFilePath ? fs.readFileSync(htmlFilePath).toString() : '',
                    exampleDocTs: tsFilePath ? fs.readFileSync(tsFilePath).toString() : '',
                    filepath: modulePath,
                    moduleName,
                    selector: uniqueComponentName,
                    content: fs.readFileSync(modulePath).toString(),
                });
            }
        }
        return examples;
    }

    private updateModuleFile(examples: DocExample[]): void {
        let examplesModuleFile: string = fs.readFileSync(this.examplesModulePath).toString();
        const matcher = /(#regionstart dynamic-module-imports\s)([\s\S]*)(#regionend dynamic-module-imports)/;
        const matcherImport = /(#regionstart dynamic-imports\s)([\s\S]*)(#regionend dynamic-imports)/;
        let matchExports = (matcher.exec(examplesModuleFile) || [])[2];
        let matchImport = (matcherImport.exec(examplesModuleFile) || [])[2];

        for (const inject of examples) {

            const importLine = `import { ${inject.moduleName} } from '${inject.filepath.slice(0, -3)}';\n`;
            if (!matchImport.includes(importLine)) {
                matchImport = `${importLine}` + matchImport;
                console.info('Import is added:', inject.moduleName);
            }

            if (!matchExports.includes(inject.moduleName)) {
                matchExports = `        ${inject.moduleName},\n` + matchExports;
            }
        }

        examplesModuleFile = examplesModuleFile.replace(matcher, '$1' + matchExports + '$3');
        examplesModuleFile = examplesModuleFile.replace(matcherImport, '$1' + matchImport + '$3');

        fs.writeFileSync(this.examplesModulePath, examplesModuleFile);
    }

    private updateDataFile(examples: DocExample[]): void {
        let examplesFile: string = fs.readFileSync(this.examplesComponentPath).toString();
        const matcher = /(#regionstart dynamic-doc-examples\s)([\s\S]*)(#regionend dynamic-doc-examples)/;

        const data = [];
        for (const inject of examples) {
            const json = JSON.stringify({
                ...inject,
            }, null, 2) + ',\n';
            data.push(json);
        }
        examplesFile = examplesFile.replace(matcher, '$1' + data.join('') + '// $3');
        fs.writeFileSync(this.examplesComponentPath, examplesFile);
    }

    private updateComponentFile(examples: DocExample[]): void {
        let examplesModuleFile: string = fs.readFileSync(this.examplesComponentHtmlPath).toString();
        const matcher = /(<!-- #regionstart dynamic-selectors -->\s)([\s\S]*)(<!-- #regionend dynamic-selectors -->)/;
        let matchExports = '';

        for (const inject of examples) {
            const exampleHtml = `<${inject.selector} *ngIf="active.selector === '${inject.selector}'"></${inject.selector}>\n`;

            if (!matchExports.includes(exampleHtml)) {
                matchExports = `        ${exampleHtml}` + matchExports;
            }
        }
        examplesModuleFile = examplesModuleFile.replace(matcher, '$1' + matchExports + '      $3');

        fs.writeFileSync(this.examplesComponentHtmlPath, examplesModuleFile);
    }
}
