import { ComponentRef } from '@angular/core';

export function setComponentInput<T>(compRef: ComponentRef<T>, name: string, value: unknown): void {
    // Used for compatibility
    const inputs = (compRef?.['_tNode']?.['inputs'] ?? {}) as Record<string, string>;
        
    if (inputs && inputs[name]) {
        compRef.setInput(name, value);
    } else {
        console.warn(`No @Input() decorator present for ${compRef.componentType.name}, used deprecated method`);
        try {
            compRef.instance[name] = value;
        } catch (error) {
            console.warn(error);
        }
    }
}