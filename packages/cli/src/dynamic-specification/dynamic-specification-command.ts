import { Command } from '../command';
import { ClassDeclaration, InterfaceDeclaration, Node, Project, SymbolFlags, SyntaxKind, Type } from 'ts-morph';
import fs from 'fs';

export interface JsfNode {
    title?: string;
    type?: string;
    /** true when a node is a dynamic component with a selector */
    isSelectorConfig?: boolean;

    [key: string]: any;
}

export interface Ctx {
    definitions: { [key: string]: JsfNode };
}


export interface DynamicComponentSpecEntity {
    name: string;
    selector: string;
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

function extendsComponent(interfaceDeclaration: InterfaceDeclaration, componentKey: string): boolean {
    if (!interfaceDeclaration || !interfaceDeclaration.getBaseTypes) {
        return false;
    }
    const baseTypes: Type[] = interfaceDeclaration.getBaseTypes();

    return baseTypes.some(baseType => {
        const symbol = baseType.getSymbol();
        return symbol?.getName() === componentKey
            || extendsComponent(baseType.getSymbolOrThrow().getDeclarations()[0] as InterfaceDeclaration, componentKey);
    });
}

function getInterfaceFromNonNullableType(nonNullableType: Type): InterfaceDeclaration {
    const symbol = nonNullableType.getSymbol();
    if (symbol) {
        const declarations = symbol.getDeclarations();
        if (declarations && declarations.length > 0) {
            const declaration = declarations[0];
            if (declaration instanceof InterfaceDeclaration) {
                return declaration;
            }
        }
    }
    // TODO: change o null and add null handle
    return nonNullableType as any;
}

function isConfig(nonNullableType: Type): boolean {
    return extendsComponent(getInterfaceFromNonNullableType(nonNullableType), 'XmDynamicConfig');
}


function getFullPathToRootInterface(nonNullableType: Type): string {
    let currentType: Type | undefined = nonNullableType;
    let rootInterface: InterfaceDeclaration | undefined;

    while (currentType && !rootInterface) {
        const symbol = currentType.getSymbol();
        if (symbol && symbol.getDeclarations().length > 0) {
            const declaration = symbol.getDeclarations()[0];
            if (Node.isInterfaceDeclaration(declaration)) {
                rootInterface = declaration;
            }
        }
        currentType = currentType.getBaseTypes()[0];
    }

    let fullPath = '';
    if (rootInterface) {
        fullPath = rootInterface.getSourceFile().getFilePath();
    }

    return fullPath;
}


function getObjectProperties(nonNullableType: Type, ctx: Ctx): JsfNode {
    return nonNullableType.getProperties()
        .filter((i: any) => {
            const isGetter = i.hasFlags(SymbolFlags.GetAccessor);
            const isValuable = i.getValueDeclaration();
            const isTraceable = !isGetter && isValuable;
            if (isTraceable) return isTraceable;
            console.warn('Skip Type', i.getName(), getFullPathToRootInterface(nonNullableType));
            return false;
        })
        .map((i: any) => i.getValueDeclarationOrThrow())
        .map((i: any) => {
            const key = i.getSymbol()?.getName() || '';
            const value = getSchema(i.getType(), ctx, i);
            return ({ [key]: value });
        })
        .reduce((p: any, c: any) => (Object.assign(p, c)), {});
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

    let selector = stringLiteral.getLiteralValue();
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

    if (selector.startsWith('xm-')) {
        selector = selector.replace('xm-', '');
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

function getSchema(type: Type, ctx: Ctx, key: Type | null): JsfNode {
    const nonNullableType = type.getNonNullableType();

    if (nonNullableType.isArray() && nonNullableType.getArrayElementType()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownArrayType',
            type: 'array',
            items: getSchema(nonNullableType.getArrayElementTypeOrThrow(), ctx, type),
        };
    } else if (nonNullableType.isBoolean()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownBooleanType',
            type: nonNullableType.getText(),
        };

    } else if (nonNullableType.isBooleanLiteral()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownBooleanType',
            type: nonNullableType.getText(),
        };
    } else if (nonNullableType.isNumber()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownNumberType',
            type: nonNullableType.getText(),
        };
    } else if (nonNullableType.isString()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownStringType',
            type: nonNullableType.getText(),
        };
    } else if (nonNullableType.isStringLiteral()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownStringType',
            type: 'string',
        };
    } else if (nonNullableType.isUnknown()
        || nonNullableType.isUndefined()
        || nonNullableType.isAny()
    ) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownAnyType',
            type: 'object',
        };
    } else if (
        nonNullableType.isClass() ||
        nonNullableType.isIntersection() ||
        nonNullableType.isObject() && nonNullableType.getSymbol()?.getDeclarations().some(i =>
            i.isKind(SyntaxKind.ClassDeclaration) ||
            i.isKind(SyntaxKind.InterfaceDeclaration))
    ) {
        const name = nonNullableType.getSymbol()?.getName() + '';
        if (!ctx.definitions[name]) {
            // WORKAROUND: to mark property as a defined for recursion
            ctx.definitions[name] = { '__mock__': '__mock__' } as any;
            ctx.definitions[name] = {
                title: key?.getSymbol()?.getName() || 'UnknownObjectType',
                isSelectorConfig: isConfig(nonNullableType),
                type: 'object',
                properties: getObjectProperties(nonNullableType, ctx)
            };
        }

        return {
            title: name,
            isSelectorConfig: isConfig(nonNullableType),
            type: 'object',
            '$ref': '#/definitions/' + name,
        };
    } else if (nonNullableType.isObject()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownObjectType',
            isSelectorConfig: isConfig(nonNullableType),
            type: 'object',
            properties: getObjectProperties(nonNullableType, ctx)
        };
    } else if (nonNullableType.isEnum()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownEnumType',
            type: 'string',
            enum: nonNullableType.getUnionTypes()
                .map(t => t.getLiteralValueOrThrow()),
        };
    } else if (nonNullableType.isUnion()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownUnionType',
            'oneOf': nonNullableType.getUnionTypes()
                .map(i => getSchema(i, ctx, type)),
        };
    } else if (nonNullableType.isIntersection()) {
        return {
            title: key?.getSymbol()?.getName() || 'UnknownIntercetionType',
            'allOf': nonNullableType.getIntersectionTypes()
                .map(i => getSchema(i, ctx, type)),
        };
    }

    console.warn('Unknown type', nonNullableType.getText(), getFullPathToRootInterface(nonNullableType));
    return {
        title: key?.getSymbol()?.getName() || 'UnknownType',
        'type': 'string',
        'default': 'Unknown type!',
        'readOnly': true,
    };
}

function getConfigurationSchema(classDeclaration: ClassDeclaration): JsfNode {
    const definitions: any = {};

    const config = classDeclaration.getProperty('config')
        || classDeclaration.getSetAccessor('config')?.getParameters()?.[0];
    if (!config) {
        return { title: 'Empty', type: 'object' };
    }
    const schema = Object.assign({ properties: {} }, getSchema(config.getType(), { definitions }, config.getType()));
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
