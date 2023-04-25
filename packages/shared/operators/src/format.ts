import { interpolate } from './interpolate';
import * as _ from 'lodash';

export interface XmFormatTemplateRecursive {
    [key: string]: string | XmFormatTemplateRecursive;
}

/**
 * Converts the data with the provided template
 *
 * @remarks
 * Use 'entity' key to specify the property of the data
 *
 * @param template - THe key-value object where the value is an interpolated string
 * @param entity - The data source, the template uses 'entity' key
 * @returns The data based on a template interpolated with entity
 *
 *
 * @example
 * ```
 * const template = {
 *    entity: 'Some text',
 *    body: {
 *        test: {
 *            title: '{{entity.some_unique_field}}'
 *        },
 *    },
 *   };
 *
 * const obj = {
 *     some_unique_field: 'Random value'
 *  }
 *
 * const res = format(template, obj);
 * // Result:
 * // {
 * //    entity: 'Some text',
 * //    body: {
 * //        test: {
 * //            title: 'Random value'
 * //        },
 * //    },
 * // };
 * ```
 * @alpha
 */
export function format<T>(template: XmFormatTemplateRecursive, entity: unknown): T {
    const res = {} as T;
    for (const key in template as object) {
        if (Object.prototype.hasOwnProperty.call(template, key)) {
            const value = template[key];
            if (typeof value === 'string') {
                res[key] = interpolate(value, { entity, _ });
            } else if (value instanceof Array) {
                res[key] = formatArray(value, entity);
            } else if (typeof value === 'object') {
                res[key] = format(value, entity);
            }
        }
    }
    return res;
}

function formatArray<T = unknown>(template: Array<XmFormatTemplateRecursive>, entity: unknown): Array<T> {
    const res: T[] = [];
    template.forEach(item => {
        res.push(format<T>(item, entity));
    });
    return res;
}
