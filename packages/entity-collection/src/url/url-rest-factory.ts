import { Id, IId, QueryParams } from '../models';
import { IUrlRest } from './i-url-rest';

export function UrlRestFactory<T extends IId>(url: string): IUrlRest<T> {
    return {
        add: (entity: T): string => url,
        delete: (id: Id): string => `${url}/${id}`,
        getAll: (): string => url,
        getById: (id: Id): string => `${url}/${id}`,
        query: (params: QueryParams): string => url,
        update: (update: Partial<T>): string => url,
        replace: (update: Partial<T>): string => url,
        upsert: (entity: T): string => url,
    };
}
