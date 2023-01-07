import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Client } from './client.model';

@Injectable()
export class ClientService {

    private resourceUrl: string = 'uaa/api/clients';
    private resourceUrlByClientId: string = this.resourceUrl + '/clientid-contains';

    constructor(private http: HttpClient) {
    }

    public create(client: Client): Observable<HttpResponse<Client>> {
        return this.http.post<Client>(this.resourceUrl, client, { observe: 'response' });
    }

    public update(client: Client): Observable<HttpResponse<Client>> {
        return this.http.put<Client>(this.resourceUrl, client, { observe: 'response' });
    }

    public find(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.resourceUrl}/${id}`);
    }

    public query(req?: any): Observable<HttpResponse<Client[]>> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
        }
        return this.http.get<Client[]>(this.resourceUrl, { params, observe: 'response' });
    }

    public filterByClientId(req: any): Observable<HttpResponse<Client[]>> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
            if (req.clientId) {
                params = params.set('clientId', req.clientId);
            }
        }
        return this.http.get<Client[]>(this.resourceUrlByClientId, { params, observe: 'response' });
    }

    public delete(id: number): Observable<HttpResponse<unknown>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    public unblock(client: Client): Observable<void> {
        return this.http.put<void>(`${this.resourceUrl}/${client.clientId}/activate`, {});
    }

    public block(client: Client): Observable<void> {
        return this.http.put<void>(`${this.resourceUrl}/${client.clientId}/block`, {});
    }
}
