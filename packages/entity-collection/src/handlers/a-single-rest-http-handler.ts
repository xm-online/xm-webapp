import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Id, IId, QueryParams } from '../models';
import { AHttpRestHandler } from './a-http-rest-handler';

interface Entity<T> {
    type: 'add' | 'upsert';
    entity: T;
}

interface PartialEntity<T> {
    type: 'update' | 'replace';
    entity?: Partial<T>;
}

interface EntityId {
    type: 'getById' | 'delete';
    id: Id;
}

interface EntityQueryParams {
    type: 'query';
    params?: QueryParams;
}

export type HandlerRequest<T extends IId> = Entity<T> |
    PartialEntity<T>
    | EntityId
    | EntityQueryParams
    | { type: 'getAll' };

export type HandlerResponse<T extends IId> = T | T[] | unknown | any;
export type HandlerNext<T extends IId> = () => Observable<HttpResponse<HandlerResponse<T>>>;

export abstract class ASingleRestHttpHandler<T extends IId> extends AHttpRestHandler<T> {

    public update(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.handle({entity, type: 'update'}, () => super.update(entity));
    }

    public replace(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.handle({entity, type: 'replace'}, () => super.replace(entity));
    }

    public getAll(): Observable<HttpResponse<T[]>> {
        return this.handle({type: 'getAll'}, () => super.getAll());
    }

    public getById(id: Id): Observable<HttpResponse<T>> {
        return this.handle({id, type: 'getById'}, () => super.getById(id));
    }

    public delete(id: Id): Observable<HttpResponse<unknown>> {
        return this.handle({id, type: 'delete'}, () => super.delete(id));
    }

    public query(params: QueryParams): Observable<HttpResponse<T[]>> {
        return this.handle({params, type: 'query'}, () => super.query(params));
    }

    public upsert(entity: T): Observable<HttpResponse<T>> {
        return this.handle({entity, type: 'upsert'}, () => super.upsert(entity));
    }

    public add(entity: T): Observable<HttpResponse<T>> {
        return this.handle({entity, type: 'add'}, () => super.add(entity));
    }

    public abstract handle<R>(request: HandlerRequest<T>, next: HandlerNext<T>): Observable<R>;

}
