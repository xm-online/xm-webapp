import { forEach, isArray, isPlainObject, set } from 'lodash';

const flatten = (collection: object, prefix: string = '', suffix: string = '', result: object): object => {
    forEach(collection, (value, key) => {
        const path = `${prefix}${key}${suffix}`;
        if (isArray(value)) {
            flatten(value, `${path}[`, ']',result);
        } else if (isPlainObject(value)) {
            flatten(value, `${path}.`,'',result);
        } else {
            result[path] = value;
        }
    });
    return result;
};

export const flattenObjectDeep = (obj: object = {}, prefix: string): Record<string, unknown> => {
    const result = {};
    flatten(obj, prefix,'',result);
    return result;
};

export const unFlattenObjectDeep = (obj: object = {}, prefix: string): object => {
    const unFlattenObject = (obj, prefix: string = '') =>
        Object.keys(obj).reduce((res, key) => {
            const newKey = key.startsWith(prefix) ? key.substring(prefix.length) : key;
            set(res, newKey, obj[key]);
            return res;
        }, {});
    return unFlattenObject(obj, prefix);

};


