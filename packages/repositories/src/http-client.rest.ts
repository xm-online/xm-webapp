import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { IEntityCollectionPageable, Pageable } from './i-entity-collection-pageable';
import { Id, IId } from '@xm-ngx/interfaces';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { QueryParams } from './i-entity-collection';

export interface XmRepositoryConfig {
    resourceUrl: string
}

export class HttpClientRest<T extends IId = unknown, Extra extends Pageable = Pageable> implements IEntityCollectionPageable<T, Extra> {

    public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private loadingCount = 0; // counter of loading that in progress

    public constructor(protected plural: string,
                       protected readonly httpClient: HttpClient) {
    }

    public get url(): string {
        return this.resourceUrl();
    }

    public request<R>(
        method: string,
        body?: unknown,
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        },
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        },
    ): Observable<R> {
        const req = this.httpClient.request<R>(method, this.url, {
            body,
            params,
            headers,
            responseType: 'json',
            observe: 'body',
        });

        return this.handle<R>(req);
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.post<T>(this.url, entity, { params, observe: 'response', headers }));
    }

    public patch<E, R>(entity: Partial<E>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<R>> {
        return this.handle(this.httpClient.patch<R>(this.url, entity, { params, observe: 'response', headers }));
    }

    public update(entity: Partial<T>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.put<T>(this.url, entity, { params, observe: 'response', headers }));
    }

    public getAll(params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        return this.handle(
            this.httpClient.get<T[] & Extra>(this.url, { params, observe: 'response', headers }).pipe(
                map(res => this.extractExtra(res, params)),
            ),
        );
    }

    public getById(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.find(key, params, headers);
    }

    public find(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.get<T>(`${this.url}/${key}`, { params, observe: 'response', headers }));
    }

    public delete(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<unknown>> {
        return this.handle(this.httpClient.delete<unknown>(`${this.url}/${key}`, {
            params,
            observe: 'response',
            headers,
        }));
    }

    public query(params: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        return this.handle(
            this.httpClient.get<T[] & Extra>(this.url, { params, observe: 'response', headers }).pipe(
                map(res => this.extractExtra(res, params)),
            ),
        );
    }

    public upsert(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        if (entity.id) {
            return this.create(entity, params, headers);
        }
        return this.update(entity, params, headers);

    }

    public handle<T>(obs: Observable<T>): Observable<T> {
        return this.loadingPipe(obs);
    }

    protected resourceUrl(): string {
        return this.plural;
    }

    protected extractExtra(res: HttpResponse<any>, params?: QueryParams): HttpResponse<T[] & Extra> {
        const extra = {
            pageIndex: 0,
            pageSize: res.body?.length || 0,
            total: res.body?.length || 0,
        } as Extra;
        const items = res.body;
        const body = Object.assign(items, extra);
        return res.clone({ body });
    }

    private loadingPipe<T>(obs: Observable<T>): Observable<T> {
        return defer(() => {
            this.loading$.next(true);
            this.loadingCount++;
            return obs.pipe(
                finalize(() => {
                    this.loadingCount--;
                    this.loading$.next(this.loadingCount > 0);
                }),
            );
        });
    }
}
