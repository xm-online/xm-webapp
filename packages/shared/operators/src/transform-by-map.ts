import { get } from 'lodash';

/**
 * Transform object according to options.map
 * @param value - previous value
 * @param optionsMap
 * @return new value
 * @example
 *  entityMap({name: 'Rex'}, {value: {map:{'oldName': 'name'}}} );
 *  // result: {oldName: 'Rex'}
 */
export function transformByMap<T, R>(value: T, optionsMap: { [key in keyof R]: string }): R {
    const result = {} as R;
    for (const optionKey in optionsMap) {
        if (Object.prototype.hasOwnProperty.call(optionsMap, optionKey)) {
            const optionValue = optionsMap[optionKey];
            if (typeof optionValue === 'string') {
                result[optionKey] = get(value, optionValue);
            }
        }
    }

    return result;
}
