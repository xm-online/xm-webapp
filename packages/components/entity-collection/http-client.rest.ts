import { HttpClient, HttpResponse } from '@angular/common/http';
import { Id, IId } from '@xm-ngx/shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IEntityCollection, QueryParams } from './i-entity-collection';

export class HttpClientRest<T extends IId = unknown> implements IEntityCollection<T> {

    public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly url: string;

    public constructor(public readonly plural: string,
                       public readonly httpClient: HttpClient) {
        this.url = `${plural}`;
    }

    public create(entity: T, params?: QueryParams): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.post<T>(this.url, entity, {params, observe: 'response'}));
    }

    public update(entity: Partial<T>, params?: QueryParams): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.put<T>(this.url, entity, {params, observe: 'response'}));
    }

    public getAll(params?: QueryParams): Observable<HttpResponse<T[]>> {
        return this.handle(this.httpClient.get<T[]>(this.url, {params, observe: 'response'}));
    }

    public getById(key: Id, params?: QueryParams): Observable<HttpResponse<T>> {
        return this.find(key, params);
    }

    public find(key: Id, params?: QueryParams): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.get<T>(`${this.url}/${key}`, {params, observe: 'response'}));
    }

    public delete(key: Id, params?: QueryParams): Observable<HttpResponse<unknown>> {
        return this.handle(this.httpClient.delete<unknown>(`${this.url}/${key}`, {
            params,
            observe: 'response',
        }));
    }

    public query(params: QueryParams): Observable<HttpResponse<T[]>> {
        return this.handle(this.httpClient.get<T[]>(this.url, {params, observe: 'response'}));
    }

    public upsert(entity: T, params?: QueryParams): Observable<HttpResponse<T>> {
        if (entity.id) {
            return this.create(entity, params);
        } else {
            return this.update(entity, params);
        }
    }

    public handle<T>(obs: Observable<T>): Observable<T> {
        return this.loadingHandle(obs);
    }

    private loadingHandle<T>(obs: Observable<T>): Observable<T> {
        this.loading$.next(true);
        return obs.pipe(finalize(() => this.loading$.next(false)));
    }
}
