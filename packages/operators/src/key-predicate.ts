import { Primitive } from '@xm-ngx/interfaces';
import { get, isArray, isPlainObject, findIndex } from 'lodash';

export interface NestedKeyFilters {
    [name: string]: {
        prop: string;
        predicate: Record<string, unknown>;
    }[];
}

export type NestedKeyResult = Record<string, unknown>;

export function searchNestedByPredicate(data: unknown[], keyFilters?: NestedKeyFilters): NestedKeyResult {
    const ret = {} as NestedKeyResult;

    if (!isPlainObject(keyFilters)) {
        return ret;
    }

    for (const [key, filters] of Object.entries(keyFilters)) {
        if (!isArray(filters)) {
            continue;
        }

        let stack = data;

        for (const { prop, predicate } of filters) {
            const searchIndex = findIndex(stack, predicate);

            if (searchIndex === -1) {
                continue;
            }

            const objectOrArray = get<unknown[], string, Primitive | object[]>(stack, `${searchIndex}`, null);
            const value = get(objectOrArray, prop, '');

            if (isArray(value)) {
                stack = value;
                continue;
            }

            ret[key] = value;
        }
    }

    return ret;
}
