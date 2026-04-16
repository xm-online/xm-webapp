import { Primitive } from '@xm-ngx/interfaces';
import { get, isArray, isPlainObject, findIndex, has } from 'lodash';

export interface NestedKeyFilters {
    [name: string]: {
        prop: string;
        predicate: Record<string, unknown>;
        hasProperty?: string;
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

        for (const { prop, predicate, hasProperty } of filters) {
            const searchIndex = findIndex(stack, (item) => {
                const predicateMatch = findIndex([item], predicate) === 0;
                if (!predicateMatch) {
                    return false;
                }
                if (hasProperty) {
                    return has(item, hasProperty);
                }
                return true;
            });

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
