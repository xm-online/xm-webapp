import { interpolate } from './interpolate';
import * as _ from 'lodash';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';

export interface XmFormatJsTemplateRecursive {
    [key: string]: JavascriptCode | XmFormatJsTemplateRecursive | Array<XmFormatJsTemplateRecursive>;
}

/**
 * Converts the data with the provided template
 *
 * @remarks
 * Use 'entity' key to specify the property of the data
 *
 * @param template - THe key-value object where the value is an interpolated string
 * @param context - The data source, the template uses 'entity' key in context
 * @returns The data based on a template interpolated with entity
 *
 * @example
 * ```
 * const template = {
 *    entity: '"Some text"',
 *    body: {
 *        test: {
 *            title: 'entity.some_unique_field'
 *        },
 *    },
 *   };
 *
 * const context = {
 *     entity:{some_unique_field: 'Random value'}
 *  }
 *
 * const res = formatJs(template, context);
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
 */
export function formatJs<T>(template: XmFormatJsTemplateRecursive, context: object): T {
    const res = {} as T;
    for (const key in template) {
        if (Object.prototype.hasOwnProperty.call(template, key)) {
            const value = template[key];
            if (typeof value === 'string') {
                res[key] = interpolate(value, context);
            } else if (value instanceof Array<XmFormatJsTemplateRecursive>) {
                res[key] = _.map(value, item => formatJs<T>(item, context));
            } else if (typeof value === 'object') {
                res[key] = formatJs(value, context);
            }
        }
    }
    return res;
}
