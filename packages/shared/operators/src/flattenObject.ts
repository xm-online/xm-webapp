type Flatten = Record<string, unknown>
const createKey = (path: string[], key: string, separator: string) => [...path, key].join(separator);

function deep(obj: Flatten, path: string[] = [], separator: string): Array<Flatten> {
    return [].concat(
        ...Object.keys(obj).map((key) => {
            const value = obj[key];
            if (typeof value === 'object'
                && value !== null) {
                return deep(value as Flatten, [...path, key], separator);
            }
            return { [createKey(path, key, separator)]: value };
        }),
    );
}

/**
 * TODO: do not support Arrays
 *
 */
export function flattenObject(object: Flatten, separator: string = '.'): Flatten {
    const flattenObj = deep(object, [], separator);
    return Object.assign({}, ...flattenObj);
}
