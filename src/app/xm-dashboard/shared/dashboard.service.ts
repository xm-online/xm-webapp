import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS } from '@xm-ngx/core';
import { createRequestOption } from '@xm-ngx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';
import { Dashboard, DashboardWithWidgets } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private resourceUrl: string = `${SERVER_API_URL}/dashboard/api/dashboards`;

    constructor(private http: HttpClient) {
    }

    public create(dashboard: Dashboard): Observable<HttpResponse<Dashboard>> {
        const copy = this.convert(dashboard);
        return this.http.post<Dashboard>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    public createBulk(body: DashboardWithWidgets[]): Observable<void> {
        return this.http.request<void>('POST', 'dashboard/api/dashboards/bulk', {body});
    }

    public update(dashboard: Dashboard): Observable<HttpResponse<Dashboard>> {
        const copy = this.convert(dashboard);
        return this.http.put<Dashboard>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    public updateBulk(body: DashboardWithWidgets[]): Observable<void> {
        return this.http.request<void>('UPDATE', 'dashboard/api/dashboards/bulk', {body});
    }

    public find(id: number): Observable<HttpResponse<DashboardWithWidgets>> {
        return this.http.get<Dashboard>(`${this.resourceUrl}/${id}`, { observe: 'response' }).pipe(
            map((res: HttpResponse<Dashboard>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<Dashboard[]>> {
        const options = createRequestOption(req);
        return this.http.get<Dashboard[]>(
            this.resourceUrl,
            {
                params: options,
                headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS,
                observe: 'response',
            },
        ).pipe(
            map((res: HttpResponse<Dashboard[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    public deleteBulk(body: DashboardWithWidgets[]): Observable<void> {
        return this.http.request<void>('DELETE', 'dashboard/api/dashboards/bulk', {body});
    }

    private convertResponse(res: HttpResponse<Dashboard>): HttpResponse<Dashboard> {
        const body: Dashboard = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertArrayResponse(res: HttpResponse<Dashboard[]>): HttpResponse<Dashboard[]> {
        const jsonResponse: Dashboard[] = res.body;
        const body: Dashboard[] = [];

        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to Dashboard.
     */
    private convertItemFromServer(dashboard: Dashboard): Dashboard {
        return { ...dashboard };
    }

    /**
     * Convert a Dashboard to a JSON which can be sent to the server.
     */
    private convert(dashboard: Dashboard): Dashboard {
        return { ...dashboard };
    }
}
