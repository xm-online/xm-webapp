const recurrentDepsLimit = 29;

function filter(censor: unknown): (this: unknown, key: string, value: unknown) => unknown {
    let i = 0;

    return (key, value) => {
        if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= recurrentDepsLimit)
            return '[Unknown]';

        ++i;

        return value;
    };
}

/**
 * @public
 * Covert object to string with circular dependencies
 * @param obj - object
 */
export function jsonSafeStringify(obj: unknown): string {
    return JSON.stringify(obj, filter(obj));
}
