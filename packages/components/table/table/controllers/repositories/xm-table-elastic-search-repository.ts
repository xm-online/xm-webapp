import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientRest, QueryParamsPageable } from '@xm-ngx/components/entity-collection';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/entity';
import { Injectable } from '@angular/core';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { map } from 'rxjs/operators';
import { SortDirection } from '@angular/material/sort';

export interface XmTableElasticSearchRepositoryExtraSort {
    [key: string]: SortDirection;
}

export interface XmTableElasticSearchRepositoryExtra {
    from: number,
    size: number;
    sort?: XmTableElasticSearchRepositoryExtraSort[];
}

export interface XmTableElasticSearchRepositoryQuery {
    query: {
        query_string: {
            query: string;
        }
    },
}

export type XmTableElasticSearchRepositoryQueryParamsPageable = {query: string} & QueryParamsPageable;

export type XmTableElasticSearchRepositoryRequest = QueryParamsPageable
    & XmTableElasticSearchRepositoryExtra
    & XmTableElasticSearchRepositoryQuery;

@Injectable()
export class XmTableElasticSearchRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable> {
    constructor(httpClient: HttpClient) {
        super(null, httpClient);
    }

    public get resourceUrl(): string {
        return this.url;
    }

    public set resourceUrl(value: string) {
        this.url = value;
    }

    public query(queryParams: XmTableElasticSearchRepositoryQueryParamsPageable, headers?: HttpHeaders): Observable<HttpResponse<T[] & PageableAndSortable>> {
        const params = this.getParams(queryParams);
        return this.handle(
            this.httpClient.post<T[] & HttpResponse<T[] & PageableAndSortable>>(this.url, params, {
                observe: 'response',
                headers
            }).pipe(
                map(res => this.extractExtra(res, params as XmTableElasticSearchRepositoryRequest)),
            ),
        );
    }

    protected getParams(params: XmTableElasticSearchRepositoryQueryParamsPageable): XmTableElasticSearchRepositoryRequest {
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
                        query: params.query
                    }
                }
            }
        }

        return _.merge(
            query,
            extra
        );
    }

    protected extractExtra(res: HttpResponse<T[]>, params?: XmTableElasticSearchRepositoryRequest): HttpResponse<T[] & PageableAndSortable> {
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
