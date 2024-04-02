import { ClassDeclaration, Node, SyntaxKind } from 'ts-morph';

export function getSelectorValue(classDeclaration: ClassDeclaration): string {
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

    return selector;
}
