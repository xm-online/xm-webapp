import { Id, IId, QueryParams } from '../models';

export interface IRestUrl<T extends IId> {
    add(entity: T): string;

    delete(id: Id): string;

    getAll(): string;

    getById(id: Id): string;

    query(params: QueryParams): string;

    update(update: Partial<T>): string;

    replace(update: Partial<T>): string;

    upsert(entity: T): string;
}

export class UrlRest<T extends IId> implements IRestUrl<T> {
    public add = (entity: T): string => this.url;
    public delete = (id: Id): string => `${this.url}/${id}`;
    public getAll = (): string => this.url;
    public getById = (id: Id): string => `${this.url}/${id}`;
    public query = (params: QueryParams): string => this.url;
    public update = (update: Partial<T>): string => this.url;
    public replace = (update: Partial<T>): string => this.url;
    public upsert = (entity: T): string => this.url;

    constructor(public url: string) {}

}
