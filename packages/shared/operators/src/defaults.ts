import { cloneDeep, defaultsDeep } from 'lodash';

export function Defaults<T>(defaultValue: T) {
    return (target: unknown, propertyKey: string): void => {
        let value: T = cloneDeep<T>(defaultValue);
        const getter = () => value;
        const setter = (newValue: T) => value = defaultsDeep({}, newValue, defaultValue) as T;
        Object.defineProperty(
            target,
            propertyKey,
            {get: getter, set: setter},
        );
    };
}
