import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '@xm-ngx/operators';
import { FunctionContext } from './function-context.model';

@Injectable()
export class FunctionContextService {

    private resourceUrl: string ='entity/api/function-contexts';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(functionContext: FunctionContext): Observable<HttpResponse<FunctionContext>> {
        const copy = this.convert(functionContext);
        return this.http.post<FunctionContext>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<FunctionContext>) => this.convertResponse(res)));
    }

    public update(functionContext: FunctionContext): Observable<HttpResponse<FunctionContext>> {
        const copy = this.convert(functionContext);
        return this.http.put<FunctionContext>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<FunctionContext>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<FunctionContext>> {
        return this.http.get<FunctionContext>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<FunctionContext>) => this.convertResponse(res)));
    }

    public query(req?: any): Observable<HttpResponse<FunctionContext[]>> {
        const options = createRequestOption(req);
        return this.http.get<FunctionContext[]>(this.resourceUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<FunctionContext[]>) => this.convertArrayResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<FunctionContext>): HttpResponse<FunctionContext> {
        const body: FunctionContext = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<FunctionContext[]>): HttpResponse<FunctionContext[]> {
        const jsonResponse: FunctionContext[] = res.body;
        const body: FunctionContext[] = [];
        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer(i));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to FunctionContext.
     */
    private convertItemFromServer(functionContext: FunctionContext): FunctionContext {
        const copy: FunctionContext = Object.assign({}, functionContext);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(functionContext.startDate);
        copy.updateDate = this.dateUtils
            .convertDateTimeFromServer(functionContext.updateDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(functionContext.endDate);
        return copy;
    }

    /**
     * Convert a FunctionContext to a JSON which can be sent to the server.
     */
    private convert(functionContext: FunctionContext): FunctionContext {
        const copy: FunctionContext = Object.assign({}, functionContext);

        copy.startDate = this.dateUtils.toDate(functionContext.startDate);

        copy.updateDate = this.dateUtils.toDate(functionContext.updateDate);

        copy.endDate = this.dateUtils.toDate(functionContext.endDate);
        return copy;
    }
}
