import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Id, IId, QueryParams } from '../models';

export interface IHttpRest<T extends IId> {

    /** POST request. Use to create an entity. */
    add(entity: T): Observable<HttpResponse<T>>;

    /** DELETE request. Use to delete an entity by id. */
    delete(id: Id): Observable<HttpResponse<unknown>>;

    /** GET request. Use to get all entities. */
    getAll(): Observable<HttpResponse<T[]>>;

    /** GET request. Use to get an entity by id. */
    getById(id: Id): Observable<HttpResponse<T>>;

    /** GET request. Use to get specific entities matched by request params. */
    query(params: QueryParams): Observable<HttpResponse<T[]>>;

    /** PATCH request. Use to update matched data. */
    update(update: Partial<T>): Observable<HttpResponse<T>>;

    /** PUT request. Use to replace or delete entity data. */
    replace(update: Partial<T>): Observable<HttpResponse<T>>;

    /** PUT request. Use to replace or create an entity. */
    upsert(entity: T): Observable<HttpResponse<T>>;
}
