import { ComponentRef } from '@angular/core';

export function setComponentInput<T>(compRef: ComponentRef<T>, name: string, value: unknown): void {
    // Used for compatibility
    const inputs = (compRef?.['_tNode']?.['inputs'] ?? {}) as Record<string, string>;
    const isInputDecoratorDeclared = inputs && inputs[name];
    const isPropertyExist = compRef.instance[name] != undefined;
    if (isInputDecoratorDeclared) {
        compRef.setInput(name, value);
    } else {
        // TODO: Define hierarchy of components and required, optional fields validation.
        if (isPropertyExist) {
            console.warn(`No @Input() decorator present for component=${compRef.componentType.name}, field=${name}, used deprecated method.`);
        }
        try {
            compRef.instance[name] = value;
        } catch (error) {
            console.warn(error);
        }
    }
}
