import { InterfaceDeclaration, SymbolFlags, SyntaxKind, Type } from 'ts-morph';

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
    return extendsComponent(getInterfaceFromNonNullableType(nonNullableType), 'XmDynamicWithConfig');
}

function extendsComponent(interfaceDeclaration: InterfaceDeclaration, componentKey: string): boolean {
    if (!interfaceDeclaration || !interfaceDeclaration.getBaseTypes) {
        return false;
    }
    const baseTypes: Type[] = interfaceDeclaration.getBaseTypes();

    return baseTypes.some(baseType => {
        const symbol = baseType.getSymbol();
        const baseInterface = symbol?.getDeclarations?.()[0] as InterfaceDeclaration | undefined;

        return symbol?.getName() === componentKey ||
            (baseInterface && extendsComponent(baseInterface, componentKey));
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


function getFullPathToRootInterface(type: Type): string {
    const typeNode = type.getSymbol()?.getDeclarations()[0];
    if (typeNode) {
        const sourceFile = typeNode.getSourceFile();
        const startLineNumber = typeNode.getStartLineNumber();
        return (`Type located in ${sourceFile.getFilePath()} at line ${startLineNumber}`);
    }
    return '';
}


function getObjectProperties(nonNullableType: Type, ctx: Ctx): JsfNode {
    return nonNullableType.getProperties()
        .filter((i: any) => {
            const isGetter = i.hasFlags(SymbolFlags.GetAccessor);
            return !isGetter;
        })
        .map(i => {
            if (i.getDeclarations().length > 1) {
                console.warn(i.getName(), 'has multiple declaration. take first.', getFullPathToRootInterface(nonNullableType) || nonNullableType.getText());
                return i.getDeclarations()[0].getSymbol();
            }
            return i;
        })
        .filter((i: any) => {
            const isValuable = i.getValueDeclaration();
            const isTraceable = isValuable;
            if (isTraceable) return isTraceable;
            console.warn('Skip Type', i.getName(), getFullPathToRootInterface(nonNullableType) || nonNullableType.getText());
            return false;
        })
        .map((i: any) => i.getValueDeclarationOrThrow())
        .map((i: any) => {
            const key = i.getSymbol()?.getName() || 'UnknownObjectKeyType';
            const value = getSchema(i.getType(), ctx, key);
            return ({[key]: value});
        })
        .reduce((p: any, c: any) => (Object.assign(p, c)), {});
}

export function getSchema(type: Type, ctx: Ctx, key: string): JsfNode {
    const nonNullableType = type.getNonNullableType();

    if (nonNullableType.isArray() && nonNullableType.getArrayElementType()) {
        return {
            title: key || 'UnknownArrayType',
            type: 'array',
            items: getSchema(nonNullableType.getArrayElementTypeOrThrow(), ctx, type?.getSymbol()?.getName() || 'UnknownArrayType'),
        };
    } else if (nonNullableType.isBoolean()) {
        return {
            title: key || 'UnknownBooleanType',
            type: nonNullableType.getText(),
        };

    } else if (nonNullableType.isBooleanLiteral()) {
        return {
            title: key || 'UnknownBooleanType',
            const: nonNullableType.getLiteralValue() || nonNullableType.getText(),
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
            const: nonNullableType.getLiteralValue() || nonNullableType.getText(),
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
            ctx.definitions[name] = {'__mock__': '__mock__'} as any;
            ctx.definitions[name] = {
                title: key || 'UnknownObjectType',
                isSelectorConfig: isConfig(nonNullableType),
                type: 'object',
                properties: getObjectProperties(nonNullableType, ctx),
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
            properties: getObjectProperties(nonNullableType, ctx),
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

    console.warn('Unknown type', type.getText(), getFullPathToRootInterface(type) || nonNullableType.getText());
    return {
        title: key || 'UnknownType',
        'type': 'string',
        'readOnly': true,
    };
}
