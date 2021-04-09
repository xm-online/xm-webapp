import { get, set } from 'lodash';

/**
 * Transform object according to options
 * @param data - previous value
 * @param mapper - where key is the new key and value is the key from the first argument
 * @returns new value
 * @example
 * ```
 *  transformByMap({oldName: 'Rex'}, {'newName': 'oldName'});
 *  // result: {newName: 'Rex'}
 * ```
 * @example
 * ```
 *  transformByMap({ creds: { login: 'Rex' } }, { 'credentials.nickname': 'creds.login' });
 *  // result: { credentials: { nickname: 'Rex' } }
 * ```
 */
export function transformByMap<T, R, M>(data: T, mapper: M): R {
    const result = {};
    for (const optionKey in mapper) {
        if (Object.prototype.hasOwnProperty.call(mapper, optionKey)) {
            const optionValue = mapper[optionKey];
            if (typeof optionValue === 'string') {
                const fieldValue: null | undefined = get(data, optionValue);
                if (fieldValue !== null && fieldValue !== undefined) {
                    set<R>(result, optionKey, fieldValue);
                }
            }
        }
    }

    return result as R;
}
