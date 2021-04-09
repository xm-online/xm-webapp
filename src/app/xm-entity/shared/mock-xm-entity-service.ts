import { HttpResponse } from '@angular/common/http';
import { QueryParams } from '@xm-ngx/components/entity-collection/i-entity-collection';
import { Link } from '@xm-ngx/entity/shared/link.model';
import { XmEntity } from '@xm-ngx/entity/shared/xm-entity.model';
import { ElasticQueryParams, Extra, XmEntityService } from '@xm-ngx/entity/shared/xm-entity.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class MockXmEntityService extends XmEntityService {

    public readonly loading$: BehaviorSubject<boolean> = of(false) as BehaviorSubject<any>;

    public create<T extends XmEntity>(xmEntity: T): Observable<HttpResponse<T>> {
        return of({} as HttpResponse<T>);
    }

    public update<T extends XmEntity>(xmEntity: T): Observable<HttpResponse<T>> {
        return of({} as HttpResponse<T>);
    }

    public find<T extends XmEntity>(id: number | string, req?: QueryParams): Observable<HttpResponse<T>> {
        return of({} as HttpResponse<T>);
    }

    public getById<T extends XmEntity>(key: number | string, params: {embed: string} & QueryParams = {embed: 'data'}): Observable<T> {
        return of(null);
    }

    public getEntitiesByIds<T extends XmEntity>(req?: QueryParams): Observable<HttpResponse<T[]>> {
        return of({} as HttpResponse<T[]>);
    }

    public query<T extends XmEntity>(req?: QueryParams): Observable<HttpResponse<T[]>> {
        return of({} as HttpResponse<T[]>);
    }

    public delete<T>(id: number | string): Observable<HttpResponse<T>> {
        return of({} as HttpResponse<T>);
    }

    public search<T extends XmEntity, R extends ElasticQueryParams & QueryParams>(req?: ElasticQueryParams): Observable<HttpResponse<T[] & Extra>> {
        return of({} as HttpResponse<T[] & Extra>);
    }

    public searchByTemplate<T extends XmEntity>(req?: any): Observable<HttpResponse<XmEntity[]>> {
        return of({} as HttpResponse<XmEntity[]>);
    }

    public getProfile(req?: any): Observable<HttpResponse<XmEntity>> {
        return of({} as HttpResponse<XmEntity>);
    }

    public getProfileByKey(key: string, req?: any): Observable<HttpResponse<XmEntity>> {
        return of({} as HttpResponse<XmEntity>);
    }

    public changeState(id: number, stateKey: string, inputContext?: any): Observable<HttpResponse<XmEntity>> {
        return of({} as HttpResponse<XmEntity>);
    }

    public createAvatar(file: File | Blob): Observable<string> {
        return of(null);
    }

    public findLinkTargets(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        return of({} as HttpResponse<Link[]>);
    }

    public findLinkSources(id: number, linkTypeKey: string, req?: any): Observable<HttpResponse<Link[]>> {
        return of({} as HttpResponse<Link[]>);
    }

    public findLinkSourcesInverted(idOrKey: string,
                                   linkTypeKey: string[],
                                   req?: any): Observable<HttpResponse<Link[]>> {
        return of({} as HttpResponse<Link[]>);
    }

    public fileExport(exportType: string, typeKey: string): Observable<Blob> {
        return of(null);
    }
}
