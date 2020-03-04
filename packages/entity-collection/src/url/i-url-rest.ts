import { Id, IId, QueryParams } from '../models';

export interface IUrlRest<T extends IId> {
    add(entity: T): string;

    delete(id: Id): string;

    getAll(): string;

    getById(id: Id): string;

    query(params: QueryParams): string;

    update(update: Partial<T>): string;

    replace(update: Partial<T>): string;

    upsert(entity: T): string;
}
