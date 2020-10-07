import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createRequestOption } from '@xm-ngx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../xm.constants';
import { DashboardWidget } from './widget.model';

@Injectable()
export class WidgetService {

    private resourceUrl: string = SERVER_API_URL + 'dashboard/api/widgets';

    constructor(private http: HttpClient) { }

    public create(widget: DashboardWidget): Observable<HttpResponse<DashboardWidget>> {
        const copy = this.convert(widget);
        return this.http.post<DashboardWidget>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<DashboardWidget>) => this.convertResponse(res)));
    }

    public update(widget: DashboardWidget): Observable<HttpResponse<DashboardWidget>> {
        const copy = this.convert(widget);
        return this.http.put<DashboardWidget>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<DashboardWidget>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<DashboardWidget>> {
        return this.http.get<DashboardWidget>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<DashboardWidget>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<DashboardWidget[]>> {
        const options = createRequestOption(req);
        return this.http.get<DashboardWidget[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<DashboardWidget[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<DashboardWidget>): HttpResponse<DashboardWidget> {
        const body: DashboardWidget = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DashboardWidget[]>): HttpResponse<DashboardWidget[]> {
        const jsonResponse: DashboardWidget[] = res.body;
        const body: DashboardWidget[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Widget.
     */
    private convertItemFromServer(widget: DashboardWidget): DashboardWidget {
        return Object.assign({}, widget);
    }

    /**
     * Convert a Widget to a JSON which can be sent to the server.
     */
    private convert(widget: DashboardWidget): DashboardWidget {
        return Object.assign({}, widget);
    }
}
