import { set } from 'lodash';

export function removeEmptyDeep<T, R>(
    data: T,
    options = { undefinedCheck: true, emptyStringCheck: true, nullCheck: false },
): R {
    const result = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (options.undefinedCheck && value === undefined) {
                continue;
            } else if (options.emptyStringCheck && typeof value === 'string' && value === '') {
                continue;
            } else if (options.nullCheck && value === null) {
                continue;
            } else if (typeof value === 'object' && value !== null) {
                set<R>(result, key, removeEmptyDeep(value));
                continue;
            }

            set<R>(result, key, value);
        }
    }

    return result as R;
}
