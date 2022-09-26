import {Command} from '../command';
import {ClassDeclaration, Node, Project, SymbolFlags, SyntaxKind, Type} from 'ts-morph';
import fs from 'fs';

export interface DynamicComponentSpecEntity {
    name: string;
    selector: string;
    compatibles: string[];
    configurationSchema: object;
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

function getSelector(classDeclaration: ClassDeclaration): string {
    const decoratorDeclaration = classDeclaration.getDecorator('Component');
    if (!decoratorDeclaration) {
        return '';
    }

    const componentDeclaration = decoratorDeclaration.getArguments()[0];
    if (!componentDeclaration) {
        return '';
    }
    if (!Node.isObjectLiteralExpression(componentDeclaration)) {
        return '';
    }

    const property = componentDeclaration.getProperty('selector');
    if (!property) {
        return '';
    }
    if (!Node.isPropertyAssignment(property)) {
        return '';
    }
    const stringLiteral = property.getFirstChildByKind(SyntaxKind.StringLiteral);
    if (!stringLiteral) {
        return '';
    }

    const selector = stringLiteral.getLiteralValue();
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
        'XmDynamicCell'
    ];
    const compatibles: string[] = [];

    for (const type of types) {
        if (names.includes(type)) {
            compatibles.push(type);
        }
    }

    return compatibles;
}

function getConfigurationSchema(classDeclaration: ClassDeclaration): object {
    const definitions: any = {};

    function getSchema(type: Type): object {
        const nonNullableType = type.getNonNullableType();

        if (nonNullableType.isArray() && nonNullableType.getArrayElementType()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: 'array',
                items: getSchema(nonNullableType.getArrayElementTypeOrThrow())
            };
        } else if (nonNullableType.isBoolean()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: nonNullableType.getText()
            };
        } else if (nonNullableType.isNumber()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: nonNullableType.getText()
            };
        } else if (nonNullableType.isString()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: nonNullableType.getText()
            };
        } else if (
            nonNullableType.isClass() ||
            nonNullableType.isIntersection() ||
            nonNullableType.isObject() && nonNullableType.getSymbolOrThrow().getDeclarations().some(i =>
                i.isKind(SyntaxKind.ClassDeclaration) ||
                i.isKind(SyntaxKind.InterfaceDeclaration))
        ) {
            const name = nonNullableType.getSymbol()?.getName() + '';
            if (!definitions[name]) {
                // WORKAROUND: to mark property as a defined for recursion
                definitions[name] = {'__mock__': '__mock__'};
                definitions[name] = {
                    title: nonNullableType.getSymbol()?.getName(),
                    type: 'object',
                    properties: nonNullableType.getProperties()
                        .filter(i => {
                            const isGetter = i.hasFlags(SymbolFlags.GetAccessor);
                            const isValuable = i.getValueDeclaration();
                            const isTraceable = !isGetter && isValuable;
                            if (isTraceable) return isTraceable;
                            console.warn('Skip Type', i.getName(), classDeclaration.getName());
                            return false;
                        })
                        .map(i => i.getValueDeclarationOrThrow())
                        .map(i => ({[i.getSymbol()?.getName() || '']: getSchema(i.getType())}))
                        .reduce((p, c) => (Object.assign(p, c)), {})
                };
            }
            return {
                title: name,
                type: 'object',
                '$ref': '#/definitions/' + name,
            };
        } else if (nonNullableType.isObject()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: 'object',
                properties: nonNullableType.getProperties()
                    .filter(i => {
                        const isGetter = i.hasFlags(SymbolFlags.GetAccessor);
                        const isValuable = i.getValueDeclaration();
                        const isTraceable = !isGetter && isValuable;
                        if (isTraceable) return isTraceable;
                        console.warn('Skip Type', i.getName(), classDeclaration.getName());
                        return false;
                    })
                    .map(i => i.getValueDeclarationOrThrow())
                    .map(i => ({[i.getSymbolOrThrow().getName()]: getSchema(i.getType())}))
                    .reduce((p, c) => (Object.assign(p, c)), {})
            };
        } else if (nonNullableType.isEnum()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                type: 'string',
                enum: nonNullableType.getUnionTypes()
                    .map(t => t.getLiteralValueOrThrow())
            };
        } else if (nonNullableType.isUnion()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                'type': 'object',
                'oneOf': nonNullableType.getUnionTypes()
                    .map(i => getSchema(i))
            };
        } else if (nonNullableType.isIntersection()) {
            return {
                title: nonNullableType.getSymbol()?.getName(),
                'type': 'object',
                'allOf': nonNullableType.getIntersectionTypes()
                    .map(i => getSchema(i))
            };
        }

        console.warn('Unknown type', nonNullableType.getText(), classDeclaration.getName());
        return {
            title: nonNullableType.getSymbol()?.getName() || 'Unknown type!',
            'type': 'string',
            'default': 'Unknown type!',
            'readOnly': true
        };
    }

    const config = classDeclaration.getProperty('config');
    if (!config) {
        return {};
    }
    const schema = Object.assign({properties: {}}, getSchema(config.getType()));
    return Object.assign(schema, {definitions});
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
                    compatibles: getCompatibleTypes(dynamicClase),
                    configurationSchema: getConfigurationSchema(dynamicClase)
                });
            }
        }
        fs.writeFileSync(
            'src/assets/specification/dynamic_components_spec_output.json',
            JSON.stringify(dynamicComponentSpecs, undefined, 2)
        );
    }
}
