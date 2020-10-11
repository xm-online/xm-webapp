import { HttpResponse } from '@angular/common/http';
import { Id, IId } from '@xm-ngx/shared/interfaces';
import { Observable } from 'rxjs';
import { IEntityCollection, QueryParams } from './i-entity-collection';

export interface Pageable {
    /** The <total> is the number of items that match the request. */
    total?: number;
    /** The <page> is the number of the requested page. */
    page?: number;
    /** The <size> is the number of items on the requested page. */
    size?: number;
}

export type QueryParamsPageable = QueryParams & Pageable;

export interface IEntityCollectionPageable<T extends IId = unknown, Extra extends Pageable = Pageable>
    extends IEntityCollection<IId> {

    /** POST request. Use to create an entity. */
    create(entity: T, params?: QueryParams): Observable<HttpResponse<T>>;

    /** DELETE request. Use to delete an entity by id. */
    delete(id: Id, params?: QueryParams): Observable<HttpResponse<unknown>>;

    /** GET request. Use to get all entities. */
    getAll(params?: QueryParamsPageable): Observable<HttpResponse<T[] & Extra>>;

    /** GET request. Use to get an entity by id. */
    getById(id: Id, params?: QueryParams): Observable<HttpResponse<T>>;

    /** GET request. Use to get specific entities matched by request params. */
    query(params: QueryParamsPageable): Observable<HttpResponse<T[] & Extra>>;

    /** PUT request. Use to replace or delete entity data. */
    update(update: Partial<T>, params?: QueryParams): Observable<HttpResponse<T>>;

    /** PUT request. Use to replace or create an entity. */
    upsert(entity: T, params?: QueryParams): Observable<HttpResponse<T>>;
}
