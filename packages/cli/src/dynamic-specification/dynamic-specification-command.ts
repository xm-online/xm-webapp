import { Command } from '../command';
import { ClassDeclaration, Project, SyntaxKind } from 'ts-morph';
import fs from 'fs';
import { getSchema, JsfNode } from './get-schema';
import { getSelectorValue } from '../selector-util';


export interface DynamicComponentSpecEntity {
    name: string;
    selector: string;
    alternativeSelector: string;
    compatibles: string[];
    configurationSchema: JsfNode;
}

function isDynamicComponent(classDeclaration: ClassDeclaration): boolean {
    const hasConfigProperty = classDeclaration.getProperties().some(i => i.getName() == 'config');
    const hasConfigSetter = classDeclaration.getSetAccessors().some(i => i.getName() == 'config');
    if (!hasConfigProperty && !hasConfigSetter) {
        return false;
    }

    const decoratorDeclaration = classDeclaration.getDecorator('Component');
    if (!decoratorDeclaration) {
        return false;
    }

    return true;
}

function getName(classDeclaration: ClassDeclaration): string {
    return classDeclaration.getName() || '';
}

function getAlternativeSelector(classDeclaration: ClassDeclaration): string {
    const selector = getSelector(classDeclaration);
    if (selector.indexOf('/xm-') > 0) {
        return selector.replace('/xm-', '/');
    }
    return selector;
}

function getSelector(classDeclaration: ClassDeclaration): string {
    const selector = getSelectorValue(classDeclaration);
    if (!selector) {
        return '';
    }

    const file = classDeclaration.getSourceFile();
    const path = file.getFilePath();
    const invertedPath = path.split('/').reverse();

    let prefix;
    if (invertedPath.includes('ext')) {
        const index = invertedPath.indexOf('ext');
        prefix = invertedPath[index - 1].replace('-webapp-ext', '');
    } else {
        const index = invertedPath.indexOf('packages');
        prefix = '@xm-ngx/' + invertedPath[index - 1];
    }

    return prefix + '/' + selector;
}

function getCompatibleTypes(classDeclaration: ClassDeclaration): string[] {
    const interfaceDeclarations = classDeclaration.getImplements();
    if (interfaceDeclarations.length == 0) {
        return [];
    }

    const names = interfaceDeclarations.map(i => i
        .getExpressionIfKindOrThrow(SyntaxKind.Identifier)
        .getSymbolOrThrow()
        .getName());

    const types = [
        'XmDynamicConfig',
        'XmDynamicWidget',
        'XmDynamicPresentation',
        'XmDynamicControl',
        'XmDynamicCell',
    ];
    const compatibles: string[] = [];

    for (const type of types) {
        if (names.includes(type)) {
            compatibles.push(type);
        }
    }

    return compatibles;
}

function getConfigurationSchema(classDeclaration: ClassDeclaration): JsfNode {
    const definitions: any = {};

    const config = classDeclaration.getProperty('config')
        || classDeclaration.getSetAccessor('config')?.getParameters()?.[0];
    if (!config) {
        return { title: 'Empty', type: 'object' };
    }
    const schema = Object.assign({ properties: {} }, getSchema(config.getType(), { definitions }, config?.getType()?.getSymbol()?.getName() || 'UnknownConfigType'));
    return Object.assign(schema, { definitions });
}

export class DynamicSpecificationCommand implements Command {
    public execute(): void {
        const project = new Project({
            tsConfigFilePath: 'tsconfig.json',
        });

        const sourceFiles = project.getSourceFiles();

        const dynamicComponentSpecs: DynamicComponentSpecEntity[] = [];
        for (const sourceFile of sourceFiles) {

            const dynamicClases = sourceFile.getClasses()
                .filter(i => isDynamicComponent(i));

            for (const dynamicClase of dynamicClases) {
                dynamicComponentSpecs.push({
                    name: getName(dynamicClase),
                    selector: getSelector(dynamicClase),
                    alternativeSelector: getAlternativeSelector(dynamicClase),
                    compatibles: getCompatibleTypes(dynamicClase),
                    configurationSchema: getConfigurationSchema(dynamicClase),
                });
            }
        }
        fs.writeFileSync(
            'src/assets/specification/dynamic_components_spec_output.json',
            JSON.stringify(dynamicComponentSpecs, undefined, 2),
        );
    }
}
