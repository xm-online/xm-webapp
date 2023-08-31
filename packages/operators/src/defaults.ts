import { cloneDeep, defaultsDeep } from 'lodash';

export function defaults<T>(newValue: Partial<T>, defaultValue: T): T {
    return defaultsDeep(cloneDeep(newValue), cloneDeep(defaultValue)) as T;
}

export function Defaults<T>(defaultValue: T) {
    return (target: unknown, propertyKey: string): void => {

        const existingDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (existingDescriptor && (existingDescriptor.get || existingDescriptor.set)) {
            // eslint-disable-next-line no-console
            console.error(`Getter or setter for property ${String(propertyKey)} is already defined.`);
        }

        const uniqueKey = `__${propertyKey}_defaults__`;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type TargetWithKey = { [uniqueKey]: T };

        const property = {
            get(this: TargetWithKey): T {
                // Unfortunately, TypeScript does not provide an instrument to define object values on creation.
                if(this[uniqueKey] === undefined){
                    // Cache
                    this[uniqueKey] = cloneDeep<T>(defaultValue);
                }

                return this[uniqueKey];
            },
            set(newValue: T) {
                this[uniqueKey] = defaults<T>(newValue, defaultValue);
            },
        };

        Object.defineProperty(
            target,
            propertyKey,
            property,
        );
    };
}
