import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { JhiDateUtils } from 'ng-jhipster';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Link } from './link.model';
import { createRequestOption } from './request-util';
import { XmEntity } from './xm-entity.model';

export interface ElasticQueryParams {
    page?: number;
    query?: string;
    size?: number;
    sort?: string | string[];
    typeKey?: string;
}

export type Extra = { xTotalCount?: number };

export const X_TOTAL_HEADER = 'X-Total-Count';

@Injectable()
export class XmEntityService {

    public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private v2ResourceUrl: string = `/entity/api/v2/xm-entities`;
    private resourceUrl: string = `/entity/api/xm-entities`;
    private resourceSearchUrl: string = `/entity/api/_search/xm-entities`;
    private resourceAvatarUrl: string = `/entity/api/storage/objects`;
    private resourceProfileUrl: string = `/entity/api/profile`;
    private resourceSearchTemplateUrl: string = `/entity/api/_search-with-template/xm-entities`;
    private getEntitiesByIdUrl: string = '/entity/api/xm-entities-by-ids';

    constructor(
        private http: HttpClient,
        private dateUtils: JhiDateUtils,
    ) {
    }

    public create<T extends XmEntity>(xmEntity: T): Observable<HttpResponse<T>> {
        const copy = this.convert(xmEntity);
        return this.handle(this.http.post<T>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res) => this.convertResponse(res))));
    }

    public update<T extends XmEntity>(xmEntity: T): Observable<HttpResponse<T>> {
        const copy = this.convert(xmEntity);
        return this.handle(this.http.put<T>(this.resourceUrl, copy, { observe: 'response' }).pipe(
            map((res) => this.convertResponse(res))));
    }

    public find<T extends XmEntity>(id: number | string, req?: QueryParams): Observable<HttpResponse<T>> {
        const options = createRequestOption(req);
        return this.handle(this.http.get<T>(`${this.resourceUrl}/${id}`, { params: options, observe: 'response' }).pipe(
            map((res) => this.convertResponse(res))));
    }

    public getById<T extends XmEntity>(key: number | string, params: { embed: string } & QueryParams = { embed: 'data' }): Observable<T> {
        return this.handle(this.http.get<T>(`${this.resourceUrl}/${key}`, { params }).pipe(
            map((res) => this.convertItemFromServer(res)),
        ));
    }

    public getEntitiesByIds<T extends XmEntity>(req?: QueryParams): Observable<HttpResponse<T[]>> {
        const options = createRequestOption(req);
        return this.handle(this.http.get<T[]>(this.getEntitiesByIdUrl, { params: options, observe: 'response' }).pipe(
            map((res) => this.convertArrayResponse<T>(res))));
    }

    public query<T extends XmEntity>(req?: QueryParams): Observable<HttpResponse<T[]>> {
        const options = createRequestOption(req);
        return this.handle(this.http.get<T[]>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
            map((res) => this.convertArrayResponse<T>(res))));
    }

    public delete<T>(id: number | string): Observable<HttpResponse<T>> {
        return this.handle(this.http.delete<T>(`${this.resourceUrl}/${id}`, { observe: 'response' }));
    }

    public search<T extends XmEntity, R extends ElasticQueryParams & QueryParams>(req?: ElasticQueryParams): Observable<HttpResponse<T[] & Extra>> {
        const options = createRequestOption(req);
        return this.handle(this.http.get<T[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
            map((res) => {
                const copy: HttpResponse<T[] & Extra> = this.convertArrayResponse<T>(res);
                copy.body.xTotalCount = parseInt(res.headers.get(X_TOTAL_HEADER), 10);
                return copy;
            }),
        ));
    }

    /**
     *  Template  (sting) - a template identifier from the search-templates.yml.
     *  templateParams ([]|{}) - a named parameters for the template.
     */
    public searchByTemplate<T extends XmEntity>(req?: any): Observable<HttpResponse<XmEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchTemplateUrl, { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<XmEntity[]>) => this.convertArrayResponse(res)));
    }

    public getProfile(req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    public getProfileByKey(key: string, req?: any): Observable<HttpResponse<XmEntity>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(
            `${this.resourceProfileUrl}/${key}`,
            { params: options, observe: 'response' }).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
        );
    }

    public changeState(id: number, stateKey: string, inputContext?: any): Observable<HttpResponse<XmEntity>> {
        const copy = inputContext ? this.convertFormData(inputContext) : null;
        return this.http.put<XmEntity>(
            `${this.resourceUrl}/${id}/states/${stateKey}`,
            copy,
            { observe: 'response' }).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
        );
    }

    public createAvatar(file: File | Blob): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.resourceAvatarUrl, formData, { responseType: 'text' });
    }

    public findLinkTargets(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/targets?typeKey=${linkTypeKey}`,
            { params: options, observe: 'response' });
    }

    public findLinkSources(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/sources?typeKey=${linkTypeKey}`,
            { params: options, observe: 'response' });
    }

    public findLinkSourcesInverted(idOrKey: string,
                                   linkTypeKey: string[],
                                   req?: any): Observable<HttpResponse<Link[]>> {
        const options = createRequestOption(req);
        return this.http.get<Link[]>(`${this.v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkTypeKey}`,
            { params: options, observe: 'response' });
    }

    public fileExport(exportType: string, typeKey: string): Observable<Blob> {
        return this.http.get(`${this.resourceUrl}/export/`, {
            responseType: 'blob',
            params: {
                fileFormat: exportType ? exportType : 'csv',
                typeKey,
            },
        });
    }

    private convertResponse<T>(res: HttpResponse<T>): HttpResponse<T> {
        const body: T = this.convertItemFromServer(res.body);
        return res.clone<T>({ body });
    }

    private convertArrayResponse<T>(res: HttpResponse<T[]>): HttpResponse<T[]> {
        const jsonResponse: T[] = res.body || [];
        const body: T[] = [];

        for (const i of jsonResponse) {
            body.push(this.convertItemFromServer<T>(i));
        }
        return res.clone<T[]>({ body });
    }

    /**
     * Convert a returned JSON object to XmEntity.
     */
    private convertItemFromServer<T extends XmEntity>(xmEntity: T): T {
        if (!xmEntity) {
            xmEntity = {} as T;
        }
        const copy: XmEntity = { ...xmEntity };
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.startDate);
        copy.updateDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.updateDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.endDate);
        return copy as T;
    }

    /**
     * Convert a XmEntity to a JSON which can be sent to the server.
     */
    private convert(xmEntity: XmEntity): XmEntity {
        if (!xmEntity) {
            xmEntity = {};
        }
        const copy: XmEntity = { ...xmEntity };

        copy.startDate = xmEntity.startDate instanceof Date
            ? xmEntity.startDate
            : this.dateUtils.toDate(xmEntity.startDate);

        copy.updateDate = xmEntity.updateDate instanceof Date
            ? xmEntity.updateDate
            : this.dateUtils.toDate(xmEntity.updateDate);

        copy.endDate = xmEntity.endDate instanceof Date ? xmEntity.endDate : this.dateUtils.toDate(xmEntity.endDate);
        return copy;
    }

    /**
     * Convert a InputContext to a JSON which can be sent to the server.
     */
    private convertFormData(inputContext: any): any {
        return { ...inputContext };
    }

    private handle<T>(obs: Observable<T>): Observable<T> {
        return this.handleLoading(obs);
    }

    private handleLoading<T>(obs: Observable<T>): Observable<T> {
        this.loading$.next(true);
        return obs.pipe(finalize(() => this.loading$.next(false)));
    }
}
