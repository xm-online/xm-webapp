import { Observable } from 'rxjs';
import { Id, IId, QueryParams } from '../models';

export interface IRestEntityJsonPath<T extends IId> {

    /** POST request. Use to create entities. */
    add(entities: T[]): Observable<T[]>;

    /** DELETE request. Use to delete an entity by id. */
    delete(ids: Id[]): Observable<Id[]>;

    /** GET request. Use to get all entities. */
    getAll(): Observable<T[]>;

    /** GET request. Use to get an entity by id. */
    getById(ids: Id[]): Observable<T[]>;

    /** GET request. Use to get specific entities matched by request params. */
    query(params: QueryParams): Observable<T[]>;

    /** PATCH request. Use to update matched data. */
    update(update: Array<Partial<T>>): Observable<T[]>;

    /** PUT request. Use to replace or delete entity data. */
    replace(update: Array<Partial<T>>): Observable<T[]>;

    /** PUT request. Use to replace or create an entity. */
    upsert(entities: T[]): Observable<T[]>;
}
