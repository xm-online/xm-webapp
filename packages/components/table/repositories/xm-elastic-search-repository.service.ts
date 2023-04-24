import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientRest, QueryParamsPageable, XmRepositoryConfig } from '@xm-ngx/components/entity-collection';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/entity';
import { Injectable } from '@angular/core';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { map } from 'rxjs/operators';
import { SortDirection } from '@angular/material/sort';
import { XmDynamicService } from '@xm-ngx/dynamic';

export interface XmElasticSearchRepositoryExtraSort {
    [key: string]: SortDirection;
}

export interface XmTableElasticSearchRepositoryExtra {
    from: number,
    size: number;
    sort?: XmElasticSearchRepositoryExtraSort[];
}

export interface XmTableElasticSearchRepositoryQuery {
    query: {
        query_string: {
            query: string;
        }
    },
}

export type XmElasticSearchRepositoryQueryParamsPageable = {query: string} & QueryParamsPageable;

export type XmElasticSearchRepositoryRequest = QueryParamsPageable
    & XmTableElasticSearchRepositoryExtra
    & XmTableElasticSearchRepositoryQuery;

@Injectable()
export class XmElasticSearchRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {

    constructor(httpClient: HttpClient) {
        super(null, httpClient);
    }

    public config: XmRepositoryConfig;

    protected override resourceUrl(): string{
        return this.config.resourceUrl;
    }

    public query(queryParams: XmElasticSearchRepositoryQueryParamsPageable, headers?: HttpHeaders): Observable<HttpResponse<T[] & PageableAndSortable>> {
        const params = this.getParams(queryParams);
        return this.handle(
            this.httpClient.post<T[] & HttpResponse<T[] & PageableAndSortable>>(this.url, params, {
                observe: 'response',
                headers,
            }).pipe(
                map(res => this.extractExtra(res, params )),
            ),
        );
    }

    protected getParams(params: XmElasticSearchRepositoryQueryParamsPageable): XmElasticSearchRepositoryRequest {
        const sortArr = Array.isArray(params.sortBy) ? params.sortBy : [params.sortBy];
        const sort = sortArr.map(item => ({[`${item?.replace('_source.', '')}.keyword`]: params.sortOrder}));
        const extra: XmTableElasticSearchRepositoryExtra = {
            size: params.pageSize,
            from: params.pageIndex,
            sort,
        };

        let query: XmTableElasticSearchRepositoryQuery;
        if(params.query) {
            query = params.query && {
                query: {
                    query_string: {
                        query: params.query,
                    },
                },
            };
        }

        return _.merge(
            query,
            extra,
        );
    }

    protected extractExtra(res: HttpResponse<T[]>, params?: XmElasticSearchRepositoryRequest): HttpResponse<T[] & PageableAndSortable> {
        const sortBy = params.sort?.map(item => _.keys(item)[0])
            .map(key => '_source.' + key.replace('.keyword', ''));
        const sortOrder = params.sort?.map(item => _.values(item)[0]);

        const extra: QueryParamsPageable = {
            pageIndex: params.from || 0,
            pageSize: params.size || 10,
            sortBy: sortBy[0],
            sortOrder: sortOrder[0],
            total: res.body['hits']['total']['value'] || 0,
        };

        const items = res.body['hits']['hits'];
        const body = Object.assign(items, extra);

        return res.clone({body});
    }
}
