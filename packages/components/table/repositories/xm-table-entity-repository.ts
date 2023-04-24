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

export interface XmTableEntityRepositoryExtra {
    page: number,
    size: number;
    sort: string;
}

export type XmTableEntityRepositoryQuery = QueryParamsPageable & XmTableEntityRepositoryExtra;

@Injectable()
export class XmTableEntityRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {
    constructor(httpClient: HttpClient) {
        super(null, httpClient);
    }

    public config: {resourceUrl: string};

    protected override resourceUrl(): string{
        return this.config.resourceUrl;
    }

    public getAll(params?: QueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.getAll(this.getParams(params));
    }

    public query(params: QueryParamsPageable): Observable<HttpResponse<T[] & PageableAndSortable>> {
        return super.query(this.getParams(params));
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        if (entity.key === undefined) {
            entity.key = uuid();
        }
        return super.create(entity, params, headers);
    }

    protected getParams(params: QueryParamsPageable): QueryParamsPageable {
        const extra: XmTableEntityRepositoryExtra = {
            size: params.pageSize,
            sort: `${params.sortBy},${params.sortOrder}`,
            page: params.pageIndex,
        };

        return _.merge(params, extra);
    }

    protected extractExtra(res: HttpResponse<T[]>, params?: XmTableEntityRepositoryQuery): HttpResponse<T[] & PageableAndSortable> {
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
