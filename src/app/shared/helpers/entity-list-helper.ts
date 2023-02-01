import * as _ from 'lodash';
import { FieldOptions } from '@xm-ngx/entity/entity-list-card/entity-list-card-options.model';
import { transpilingForIE } from '../jsf-extention';
import { XmEntity } from '@xm-ngx/entity';

function fieldValueToString(field: FieldOptions, value: any): any {
    if (field && field.func) {
        try {
            return (new Function('value', `return ${field.func};`))(value);
        } catch (e) {
            const code = transpilingForIE(field.func, value);
            return (new Function('value', `return ${code}`))(value);
        }
    }
    return value;
}

export const getFieldValue = (xmEntity: any = {}, field: FieldOptions): any => {
    const value = _.get(xmEntity, field.field);

    return value ? (value instanceof Date
        ? value.toISOString().replace(/T/, ' ').split('.').shift() : fieldValueToString(field, value)) : '';
};

export const flattenEntityWithPath = (obj: XmEntity, prefix: string = ''): any => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? `${prefix}.` : '';
        if ( typeof obj[k] === 'object' && obj[k] !== null && Object.keys(obj[k]).length > 0) {
            Object.assign(acc, flattenEntityWithPath(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

export const getApplicationTypeKey = (path: string): string => {
    if (path.includes('application')) {
        const url = path.split('/');
        return url[url.indexOf('application') + 1];
    }
    return null;
};
