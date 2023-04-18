import { XmEntity } from '@xm-ngx/entity';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Column } from '../../interfaces/xm-table.model';

export function escapeQuotes(str: string): string {
    return (str + '').replace(/[\\"']/g, '\\$&')
        .replace(/[ ]/g, '\\ ')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\u0000/g, '\\0');
}

export const entityElastic = (v: XmEntity, o: Column): string => `${o.field}: ${v.id}`;
export const entitySelectElastic = (v: XmEntity, o: Column): string => `${o.field}: ${v}`;

export const strictNumberElastic = (v: string | number, o: Column): string => `${o.field}: ${v.toString().trim()}`;

export const strictStringElastic = (v: string | number, o: Column): string => `${o.field}: "${escapeQuotes(v.toString().trim())}"`;

export const booleanElastic = (v: string | boolean | null, o: Column): string => {
    if (v === true || v === 'true') {
        return `${o.field}: "${v}"`;
    }
    return `(NOT ${o.field}: true)`;
};

export const containsElastic = (v: string, o: { field?: string }): string => `${o.field}: *${escapeQuotes(v.toString().trim())}*`;

export const multiSelectElastic = (v: string[], o: { field?: string }): string => {
    if (v.length === 0) {
        return '';
    }
    const parts = _.map(v, (value) => `(${containsElastic(value, o)})`);
    return `(${_.join(parts, 'OR')})`;
};

export const userFullnameElastic = (v: string, o: Column): string => {
    if (!v) {
        return '';
    }
    return `${o.field}: ${v}`;
};

export const multiElastic = (v: string, o: Column & { filter?: { elasticFields?: string[] } }): string => {
    const parts = _.map(o.filter.elasticFields, (field) => containsElastic(v, {field}));
    return `(${_.join(parts, 'OR')})`;
};

export const nestedPropElastic = (v: any, o: Column): string => {
    const nested = v && v.nested && v.nested.value ? ` AND ${v.nested.field}: ${escapeQuotes(v.nested.value)}` : '';
    return v.field ? `${o.field}: *${escapeQuotes(v.field)}*${nested}` : v.field;
};

export const customFieldElastic = (v: unknown, o: Column & { customField?: string }): string => {
    return `${o.customField}: ${v}`;
};

export const templateElastic = (value: unknown, o: Column & { template?: string }): string => {
    return _.template(o.template)({value});
};

export const strictNumberOrStringElastic = (v: string | number, o: Column): string => (isNaN(v as number)
    ? strictStringElastic(v, o)
    : strictNumberElastic(v, o));

export const strictNumberOrContainsStringElastic = (v: string | number, o: Column): string => (isNaN(v as number)
    ? containsElastic(v as string, o)
    : strictNumberElastic(v, o));

export const dateElastic = ([f, t]: Date[], o: Column & { includeFullDay?: boolean }): string => {
    const toDate = o.includeFullDay ? moment(t).clone().endOf('day').toDate() : new Date(t);

    const from = f ? `${o.field}: >=${new Date(f).getTime()}` : '';
    const to = t ? ` AND ${o.field}: <=${toDate.getTime()}` : '';
    return from + to;
};

export const userDelegationElastic = (v: string, o: { field?: string }): string => {
    const requestNames: string[] = v.split(';');
    return multiSelectElastic(requestNames, o);
};

export const elasticQueryChips = (value: unknown): string => {
    return `${Array.isArray(value) ? value?.join(' AND ') : value}`;
}
