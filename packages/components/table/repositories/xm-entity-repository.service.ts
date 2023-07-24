import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
    HttpClientRest,
    QueryParams,
    QueryParamsPageable,
    XmRepositoryConfig
} from '@xm-ngx/components/entity-collection';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/entity';
import { uuid } from '@xm-ngx/shared/operators';
import { Injectable } from '@angular/core';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { XmFilterQueryParams } from '../controllers/collections/i-xm-table-collection-controller';
import {
    XmEntityRepositoryConfig,
} from '@xm-ngx/components/table/controllers/elastic/xm-elastic-search-repository.service';
import {
    XmElasticRequestBuilder
} from '@xm-ngx/components/table/controllers/elastic/xm-elastic-request-builder.service';

export interface XmEntityRepositoryExtra {
    page: number,
    size: number;
    sort: string;
}

export type XmEntityRepositoryQuery = QueryParamsPageable & XmEntityRepositoryExtra;

export type XmEntityRepositoryCustomConfig = XmEntityRepositoryConfig & {
    updateResourceUrl: string;
}

@Injectable()
export class XmEntityRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {
    public config: XmEntityRepositoryCustomConfig;

    constructor(httpClient: HttpClient, private requestBuilder: XmElasticRequestBuilder) {
        super(null, httpClient);
    }

    public update(entity: Partial<T>, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        const url = this.config.updateResourceUrl ?? this.url;
        
        return this.handle(this.httpClient.put<T>(url, entity, { params, observe: 'response', headers }));
    }

    public getAll(params?: XmFilterQueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.getAll(this.getParams(params));
    }

    public query(params: XmFilterQueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.query(this.getParams(params));
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        if (entity.key === undefined) {
            entity.key = uuid();
        }
        return super.create(entity, params, headers);
    }

    protected override resourceUrl(): string {
        return this.config.resourceUrl;
    }

    protected getParams(request: XmFilterQueryParams): QueryParamsPageable {
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
