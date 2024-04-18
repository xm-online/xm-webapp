import { get } from 'lodash';

export function getValue<T>(entity: unknown, field: string): T {
    if (field === null || field === undefined || field === '') {
        return entity as T;
    }

    return get(entity, field, null);
}
