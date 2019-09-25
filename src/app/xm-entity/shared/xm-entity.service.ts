import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_API_URL } from '../../xm.constants';
import { Link } from './link.model';
import { dateParse, RestfulBase, toDate } from './restful-base';
import { XmEntity } from './xm-entity.model';

@Injectable()
export class XmEntityService extends RestfulBase<XmEntity> {

    protected v2ResourceUrl: string = SERVER_API_URL + 'entity/api/v2/xm-entities';
    protected resourceUrl: string = SERVER_API_URL + 'entity/api/xm-entities';
    protected resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/xm-entities';
    protected resourceAvatarUrl: string = SERVER_API_URL + 'entity/api/storage/objects';
    protected resourceProfileUrl: string = SERVER_API_URL + 'entity/api/profile';
    protected resourceSearchTemplateUrl: string = SERVER_API_URL + 'entity/api/_search-with-template/xm-entities';
    protected getEntitiesByIdUrl = `entity/api/xm-entities-by-ids`;

    constructor(protected http: HttpClient) {
        super(http);
    }

    public find(id: number, req?: any): Observable<XmEntity> {
        const params = createRequestOption(req);
        return this.http.get<XmEntity>(`${this.resourceUrl}/${id}`, {params}).pipe(
            map(this.convertFromServer.bind(this)));
    }

    public getEntitiesByIds(req?: any): Observable<XmEntity[]> {
        const params = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.getEntitiesByIdUrl, {params}).pipe(
            map(this.convertArrayFromServer.bind(this)));
    }

    /**
     *  template  (sting) - a template identifier from the search-templates.yml.
     *  templateParams ([]|{}) - a named parameters for the template.
     */
    public searchByTemplate(req?: any): Observable<XmEntity[]> {
        const params = createRequestOption(req);
        return this.http.get<XmEntity[]>(this.resourceSearchTemplateUrl, {params}).pipe(
            map(this.convertArrayFromServer.bind(this)));
    }

    public getProfile(req?: any): Observable<XmEntity> {
        const params = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, {params}).pipe(
            map(this.convertArrayFromServer.bind(this)));
    }

    public getProfileByKey(key: string | number, req?: any): Observable<XmEntity> {
        const params = createRequestOption(req);
        return this.http.get<XmEntity>(`${this.resourceProfileUrl}/${key}`, {params}).pipe(
            map(this.convertFromServer.bind(this)));
    }

    public changeState(id: number, stateKey: string, inputContext?: XmEntity): Observable<XmEntity> {
        const copy = inputContext ? this.convertForServer(inputContext) : null;
        return this.http.put<XmEntity>(`${this.resourceUrl}/${id}/states/${stateKey}`, copy).pipe(
            map(this.convertFromServer.bind(this)));
    }

    public createAvatar(file: File | Blob): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.resourceAvatarUrl, formData, {responseType: 'text'});
    }

    public findLinkTargets(id: number, linkTypeKey: string, req?: any): Observable<Link[]> {
        const params = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/targets?typeKey=${linkTypeKey}`, {params});
    }

    public findLinkSources(id: number, linkTypeKey: string, req?: any): Observable<Link[]> {
        const params = createRequestOption(req);
        return this.http.get<Link[]>(`${this.resourceUrl}/${id}/links/sources?typeKey=${linkTypeKey}`, {params});
    }

    public findLinkSourcesInverted(idOrKey: string, linkTypeKey: string[], req?: any): Observable<Link[]> {
        const params = createRequestOption(req);
        return this.http.get<Link[]>(`${this.v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkTypeKey}`, {params});
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

    protected convertFromServer(data: XmEntity): XmEntity {
        data.startDate = dateParse(data.startDate);
        data.updateDate = dateParse(data.updateDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: XmEntity): XmEntity {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.updateDate = toDate(data.updateDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
