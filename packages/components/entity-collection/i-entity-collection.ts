import { HttpParams, HttpResponse } from '@angular/common/http';
import { Id, IId } from '@xm-ngx/shared/interfaces';
import { Observable } from 'rxjs';

export type QueryParams = HttpParams | {
    [param: string]: (string | string[] | number) | any;
};

export interface IEntityCollection<T extends IId = unknown> {
    loading$: Observable<boolean>;

    /** POST request. Use to create an entity. */
    create(entity: T, params?: QueryParams): Observable<HttpResponse<T>>;

    /** DELETE request. Use to delete an entity by id. */
    delete(id: Id, params?: QueryParams): Observable<HttpResponse<unknown>>;

    /** GET request. Use to get all entities. */
    getAll(params?: QueryParams): Observable<HttpResponse<T[]>>;

    /** GET request. Use to get an entity by id. */
    getById(id: Id, params?: QueryParams): Observable<HttpResponse<T>>;

    /** GET request. Use to get specific entities matched by request params. */
    query(params: QueryParams): Observable<HttpResponse<T[]>>;

    /** PUT request. Use to replace or delete entity data. */
    update(update: Partial<T>, params?: QueryParams): Observable<HttpResponse<T>>;

    /** PATCH request. Use to replace entity data. */
    patch<E, R>(update: Partial<E>, params?: QueryParams): Observable<HttpResponse<R>>;

    /** PUT request. Use to replace or create an entity. */
    upsert(entity: T, params?: QueryParams): Observable<HttpResponse<T>>;
}
