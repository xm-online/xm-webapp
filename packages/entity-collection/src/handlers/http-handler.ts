import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Id, IId, QueryParams } from '../models';
import { IHttpRest } from '../rest/i-http-rest';

export interface IHttpRestHandler<T extends IId> extends IHttpRest<T> {
    next: IHttpRestHandler<T>;
}

export abstract class HttpHandler<T extends IId> implements IHttpRestHandler<T> {

    public next: IHttpRestHandler<T>;

    public update(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.next.update(entity);
    }

    public replace(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.next.replace(entity);
    }

    public getAll(): Observable<HttpResponse<T[]>> {
        return this.next.getAll();
    }

    public getById(id: Id): Observable<HttpResponse<T>> {
        return this.next.getById(id);
    }

    public delete(id: Id): Observable<HttpResponse<unknown>> {
        return this.next.delete(id);
    }

    public query(params: QueryParams): Observable<HttpResponse<T[]>> {
        return this.next.query(params);
    }

    public upsert(entity: T): Observable<HttpResponse<T>> {
        return this.next.upsert(entity);
    }

    public add(entity: T): Observable<HttpResponse<T>> {
        return this.next.add(entity);
    }
}
