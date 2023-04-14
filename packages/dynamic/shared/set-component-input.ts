import { ComponentRef } from '@angular/core';

export function setComponentInput<T>(compRef: ComponentRef<T>, name: string, value: unknown): void {
    // Used for compatibility
    const inputs = (compRef?.['_tNode']?.['inputs'] ?? {}) as Record<string, string>;

    if (inputs && inputs[name]) {
        compRef.setInput(name, value);
    } else {
        try {
            // TODO: For interfaces that inherit optional field, the warn should not appear e.g. WidgetConfig.spec
            //  interfaces must be strict
            if (compRef.instance[name] !== undefined) {
                console.warn(`No @Input() decorator present for component=${compRef.componentType.name}, field=${name}, used deprecated method.`);
            }

            compRef.instance[name] = value;
        } catch (error) {
            console.warn(error);
        }
    }
}
