import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Id, IId } from '@xm-ngx/interfaces';
import { Observable } from 'rxjs';
import { IEntityCollection, QueryParams } from './i-entity-collection';

export interface Sortable {
    /** Sort by the fields. */
    sortBy?: string[] | string | null;
    /** Sort order. */
    sortOrder?: SortDirection;
}

export interface Pageable {
    /** The <total> is the number of items that match the request. */
    total?: number;
    /** The <pageIndex> is the number of the requested page. */
    pageIndex?: number;
    /** The <pageSize> is the number of items on the requested page. */
    pageSize?: number;
}

export interface PageableAndSortable extends Pageable, Sortable {
}

export const PAGEABLE_AND_SORTABLE_DEFAULT: PageableAndSortable = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    sortOrder: 'asc',
    sortBy: null,
};

export interface QueryParamsPageable extends QueryParams, PageableAndSortable{}

export interface IEntityCollectionPageable<T extends IId = unknown, Extra extends Pageable = Pageable>
    extends IEntityCollection<IId> {

    /** Manual request */
    request<R>(
        method: string,
        body?: unknown,
            params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        },
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        },
    ): Observable<R>;

    /** POST request. Use to create an entity. */
    create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>>;

    /** DELETE request. Use to delete an entity by id. */
    delete(id: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<unknown>>;

    /** GET request. Use to get all entities. */
    getAll(params?: QueryParamsPageable, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>>;

    /** GET request. Use to get an entity by id. */
    getById(id: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>>;

    /** GET request. Use to get specific entities matched by request params. */
    query(params: QueryParamsPageable, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>>;

    /** PUT request. Use to replace or delete entity data. */
    update(update: Partial<T>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>>;

    /** PATCH request. Use to replace entity data. */
    patch<E, R>(update: Partial<E>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<R>>;

    /** PUT request. Use to replace or create an entity. */
    upsert(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>>;
}
