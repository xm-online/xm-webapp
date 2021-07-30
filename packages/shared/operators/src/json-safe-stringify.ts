function filter(censor: unknown): (this: unknown, key: string, value: unknown) => unknown {
    let i = 0;

    return (key, value) => {
        if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 29) // limit of recurrent deps
            return '[Unknown]';

        ++i;

        return value;
    };
}

export function jsonSafeStringify(obj: unknown): string {
    return JSON.stringify(obj, filter(obj));
}
