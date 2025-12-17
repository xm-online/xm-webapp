import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
    HttpClientRest,
    PageableAndSortable,
    QueryParams,
    QueryParamsPageable,
    XmRepositoryConfig,
} from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/core/entity';
import { Defaults, interpolate, uuid } from '@xm-ngx/operators';
import { inject, Injectable } from '@angular/core';
import { XmDynamicInstanceService, XmDynamicService } from '@xm-ngx/dynamic';
import { XmFilterQueryParams } from '../collections/i-xm-table-collection-controller';
import { XmEntityRepositoryConfig } from '../controllers/elastic/xm-elastic-search-repository.service';
import { XmElasticRequestBuilder } from '../controllers/elastic/xm-elastic-request-builder.service';
import { Id } from '@xm-ngx/interfaces';

export interface XmEntityRepositoryExtra {
    page: number,
    size: number;
    sort: string;
}

export type XmEntityRepositoryQuery = QueryParamsPageable & XmEntityRepositoryExtra;

export type XmEntityRepositoryCustomConfig = XmEntityRepositoryConfig & {
    updateResourceUrl: string;
    /**
     * Use when you need to dynamically change resourceUrl
     * @example
     * ```ts
     * // the route is https://domain/page?id=12345
     * const config = {
     *     "isResourceUrlQueryParamsInterpolation": true,
     *     "resourceUrl": 'ms/api/someResource/{{id}}' // where `id` is the name of the property in url queryParams
     * }
     *
     * // result ms/api/someResource/12345
     * ```
     */
    isResourceUrlQueryParamsInterpolation: boolean;
    requestBuilderController?: {
        key?: string,
    },
    includes?: string[];
}

@Injectable()
export class XmEntityRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {
    @Defaults({
        paramsToRequest: null,
        resourceUrl: 'entity/api/_search/xm-entities',
    })
    public config: XmEntityRepositoryCustomConfig;
    protected activatedRoute = inject(ActivatedRoute);

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private requestBuilder: XmElasticRequestBuilder = this.xmDynamicInstanceService.getControllerByKey('table-request-builder') || inject(XmElasticRequestBuilder);
    protected httpClient: HttpClient = inject(HttpClient);

    constructor() {
        super(null, null);
    }

    public getAll(params?: XmFilterQueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.getAll(this.getParams(params));
    }

    public query(params: XmFilterQueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.query(this.getParams(params), headers);
    }

    public update(entity: Partial<T>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return this.handle(this.httpClient.put<T>(this.updateResourceUrl, entity, { params, observe: 'response', headers }));
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        if (entity.key === undefined) {
            entity.key = uuid();
        }
        return this.handle(this.httpClient.post<T>(this.updateResourceUrl, entity, { params, observe: 'response', headers }));
    }

    public patch<E, R>(entity: Partial<E>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<R>> {
        return this.handle(this.httpClient.patch<R>(this.updateResourceUrl, entity, { params, observe: 'response', headers }));
    }

    public delete(key: Id, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<unknown>> {
        return this.handle(this.httpClient.delete<unknown>(`${this.updateResourceUrl}/${key}`, {
            params,
            observe: 'response',
            headers,
        }));
    }

    protected override resourceUrl(): string {
        let url: string = this.config.resourceUrl;
        if (this.config.isResourceUrlQueryParamsInterpolation) {
            url = interpolate(url, this.activatedRoute?.snapshot?.queryParams || {});
        }
        return url;
    }

    protected get updateResourceUrl(): string {
        return this.config.updateResourceUrl ?? 'entity/api/xm-entities';
    }

    protected getParams(request: XmFilterQueryParams): QueryParamsPageable {
        if(this.config.requestBuilderController?.key) {
            this.requestBuilder = this.xmDynamicInstanceService.getControllerByKey(
                this.config.requestBuilderController.key
            );
        }

        const params = this.requestBuilder.getQueryParams(request, this.config);

        if (this.config.useOnlySpecifiedParams) {
            return params;
        }

        const extra: Partial<XmEntityRepositoryExtra> = {
            sort: `${params.sortBy},${params.sortOrder}`,
        };

        if (params.pageSize) {
            extra.size = params.pageSize;
        }

        if (params.pageIndex) {
            extra.page = params.pageIndex;
        }

        const {includes} = this.config || {};

        if (includes) {
            params.includes = includes.join(',');
        }

        return _.merge(params, extra);
    }

    protected extractExtra(res: HttpResponse<T[]>, params?: XmEntityRepositoryQuery): HttpResponse<T[] & PageableAndSortable> {
        const hasNextPage = res.headers.get('x-has-next');
        let totalPageCount: number;
        let body = res.body || [];

        if (hasNextPage === 'true') {
            totalPageCount = Infinity;
        } else {
            totalPageCount = null;
        }

        const extra: QueryParamsPageable = {
            pageIndex: params.page || 0,
            pageSize: params.size || body.length || 0,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
            total: totalPageCount
                || parseInt(res.headers.get('x-total-count'))
                || body.length || 0,
        };

        const items = res.body;
        body = Object.assign(items, extra);

        return res.clone({ body });
    }

}
