import { forEach, isArray, isPlainObject, set } from 'lodash';

export const flattenObjectWithArray = (obj = {}, globalPrefix: string): Record<string, unknown> => {
    const result = {};

    const flatten = (collection, prefix = '', suffix = '') => {
        forEach(collection, (value, key) => {
            const path = `${prefix}${key}${suffix}`;
            if (isArray(value)) {
                flatten(value, `${path}[`, ']');
            } else if (isPlainObject(value)) {
                flatten(value, `${path}.`);
            } else {
                result[path] = value;
            }
        });
    };

    flatten(obj, globalPrefix);

    return result;
};

export const unflattenObjectWithKey = (obj = {}, prefix: string): Object => {
    const unflattenObject = (obj, prefix: string = '') =>
        Object.keys(obj).reduce((res, key) => {
            const newKey = key.startsWith(prefix) ? key.substring(prefix.length) : key;
            set(res, newKey, obj[key]);
            return res;
        }, {});
    return unflattenObject(obj, prefix);

};


