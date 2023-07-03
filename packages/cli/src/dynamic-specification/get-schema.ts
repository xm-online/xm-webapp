import { InterfaceDeclaration, Node, SymbolFlags, SyntaxKind, Type } from 'ts-morph';

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

function isConfig(nonNullableType: Type): boolean {
    return extendsComponent(getInterfaceFromNonNullableType(nonNullableType), 'XmDynamicConfig');
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
            const key = i.getSymbol()?.getName() || 'UnknownObjectKeyType';
            const value = getSchema(i.getType(), ctx, key);
            return ({ [key]: value });
        })
        .reduce((p: any, c: any) => (Object.assign(p, c)), {});
}

export function getSchema(type: Type, ctx: Ctx, key: string): JsfNode {
    const nonNullableType = type.getNonNullableType();

    if (nonNullableType.isArray() && nonNullableType.getArrayElementType()) {
        return {
            title: key || 'UnknownArrayType',
            type: 'array',
            items: getSchema(nonNullableType.getArrayElementTypeOrThrow(), ctx, type?.getSymbol()?.getName() || 'UnknownArrayType')
        };
    } else if (nonNullableType.isBoolean()) {
        return {
            title: key || 'UnknownBooleanType',
            type: nonNullableType.getText(),
        };

    } else if (nonNullableType.isBooleanLiteral()) {
        return {
            title: key || 'UnknownBooleanType',
            const: nonNullableType.getLiteralValue(),
        };
    } else if (nonNullableType.isNumber()) {
        return {
            title: key || 'UnknownNumberType',
            type: nonNullableType.getText(),
        };
    } else if (nonNullableType.isString()) {
        return {
            title: key || 'UnknownStringType',
            type: nonNullableType.getText(),
        };
    } else if (nonNullableType.isStringLiteral()) {
        return {
            title: key || 'UnknownStringType',
            const: nonNullableType.getLiteralValue(),
        };
    } else if (nonNullableType.isUnknown()
        || nonNullableType.isUndefined()
        || nonNullableType.isAny()
    ) {
        return {
            title: key || 'UnknownAnyType',
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
                title: key || 'UnknownObjectType',
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
            title: key || 'UnknownObjectType',
            isSelectorConfig: isConfig(nonNullableType),
            type: 'object',
            properties: getObjectProperties(nonNullableType, ctx)
        };
    } else if (nonNullableType.isEnum()) {
        return {
            title: key || 'UnknownEnumType',
            type: 'string',
            enum: nonNullableType.getUnionTypes()
                .map(t => t.getLiteralValueOrThrow()),
        };
    } else if (nonNullableType.isUnion()) {
        return {
            title: key || 'UnknownUnionType',
            'oneOf': nonNullableType.getUnionTypes()
                .map(i => getSchema(i, ctx, key)),
        };
    } else if (nonNullableType.isIntersection()) {
        return {
            title: key || 'UnknownIntercetionType',
            'allOf': nonNullableType.getIntersectionTypes()
                .map(i => getSchema(i, ctx, key)),
        };
    }

    console.warn('Unknown type', nonNullableType.getText(), getFullPathToRootInterface(nonNullableType));
    return {
        title: key || 'UnknownType',
        'type': 'string',
        'default': 'Unknown type!',
        'readOnly': true,
    };
}
