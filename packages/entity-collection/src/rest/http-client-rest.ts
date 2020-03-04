import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Id, IId, QueryParams } from '../models';
import { IUrlRest } from '../url/i-url-rest';
import { IHttpRest } from './i-http-rest';

export class HttpClientRest<T extends IId> implements IHttpRest<T> {

    public next = null;

    public constructor(protected readonly url: IUrlRest<T>,
                       protected readonly httpClient: HttpClient) {
    }

    public add(entity: T): Observable<HttpResponse<T>> {
        return this.httpClient.post<HttpResponse<T>>(this.url.add(entity), {observe: 'response'});
    }

    public update(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.httpClient.patch<HttpResponse<T>>(this.url.update(entity), {observe: 'response'});
    }

    public replace(entity: Partial<T>): Observable<HttpResponse<T>> {
        return this.httpClient.put<HttpResponse<T>>(this.url.replace(entity), {observe: 'response'});
    }

    public getAll(): Observable<HttpResponse<T[]>> {
        return this.httpClient.get<T[]>(this.url.getAll(), {observe: 'response'});
    }

    public getById(key: Id): Observable<HttpResponse<T>> {
        return this.httpClient.get<T>(this.url.getById(key), {observe: 'response'});
    }

    public delete(key: Id): Observable<HttpResponse<unknown>> {
        return this.httpClient.delete<unknown>(this.url.delete(key), {observe: 'response'});
    }

    public query(params: QueryParams): Observable<HttpResponse<T[]>> {
        return this.httpClient.get<T[]>(this.url.query(params), {params: params as HttpParams, observe: 'response'});
    }

    public upsert(entity: T): Observable<HttpResponse<T>> {
        return this.httpClient.put<HttpResponse<T>>(this.url.replace(entity), {observe: 'response'});
    }
}
