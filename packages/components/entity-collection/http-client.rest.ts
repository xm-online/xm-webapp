import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IEntityCollectionPageable, Pageable } from './i-entity-collection-pageable';
import { Id, IId } from '@xm-ngx/shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { QueryParams } from './i-entity-collection';

export class HttpClientRest<T extends IId = unknown, Extra extends Pageable = Pageable> implements IEntityCollectionPageable<T, Extra> {

    public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly url: string;

    public constructor(public readonly plural: string,
                       public readonly httpClient: HttpClient) {
        this.url = `${plural}`;
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.post<T>(this.url, entity, { params, observe: 'response', headers }));
    }

    public update(entity: Partial<T>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.put<T>(this.url, entity, { params, observe: 'response', headers }));
    }

    public getAll(params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        return this.handle(
            this.httpClient.get<T[] & Extra>(this.url, { params, observe: 'response', headers }).pipe(
                map(res => this.extractExtra(res)),
            ),
        );
    }

    public getById(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.find(key, params);
    }

    public find(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.get<T>(`${this.url}/${key}`, { params, observe: 'response', headers }));
    }

    public delete(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<unknown>> {
        return this.handle(this.httpClient.delete<unknown>(`${this.url}/${key}`, {
            params,
            observe: 'response',
        }));
    }

    public query(params: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        return this.handle(
            this.httpClient.get<T[] & Extra>(this.url, { params, observe: 'response', headers }).pipe(
                map(res => this.extractExtra(res)),
            ),
        );
    }

    public upsert(entity: T, params?: QueryParams): Observable<HttpResponse<T>> {
        if (entity.id) {
            return this.create(entity, params);
        }
        return this.update(entity, params);

    }

    public handle<T>(obs: Observable<T>): Observable<T> {
        return this.loadingHandle(obs);
    }

    protected extractExtra(res: HttpResponse<any>): HttpResponse<T[] & Extra> {
        const extra = {
            pageIndex: 0,
            pageSize: res.body?.length || 0,
            total: res.body?.length || 0,
        } as Extra;
        const items = res.body;
        const body = Object.assign(items, extra);
        return res.clone({ body });
    }

    private loadingHandle<T>(obs: Observable<T>): Observable<T> {
        this.loading$.next(true);
        return obs.pipe(finalize(() => this.loading$.next(false)));
    }
}
