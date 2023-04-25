import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
    HttpClientRest,
    QueryParams,
    QueryParamsPageable,
    XmRepositoryConfig
} from '@xm-ngx/components/entity-collection';
import * as _ from 'lodash';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/entity';
import { Injectable } from '@angular/core';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { map } from 'rxjs/operators';
import { SortDirection } from '@angular/material/sort';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { XmFilterQueryParams } from '@xm-ngx/components/table/controllers/collections/i-xm-table-collection-controller';
import {
    Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY,
} from '@xm-ngx/components/table/controllers/elastic/xm-table-filters-elastic-string-query';
import { XmTableConfig, XmTableConfigFilters } from '@xm-ngx/components/table/interfaces/xm-table.model';
import { xmFormatJs, XmFormatJsTemplateRecursive } from '@xm-ngx/shared/operators';
import { XmTableConfigController } from '@xm-ngx/components/table/controllers';

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

export type XmElasticSearchRepositoryQueryParamsPageable = { query: string } & QueryParamsPageable;

export type XmElasticSearchRepositoryRequest = QueryParamsPageable
    & XmTableElasticSearchRepositoryExtra
    & XmTableElasticSearchRepositoryQuery;

@Injectable()
export class XmElasticSearchRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {

    public config: XmRepositoryConfig & { paramsToRequest: XmFormatJsTemplateRecursive };

    constructor(httpClient: HttpClient, private configController: XmTableConfigController<XmTableConfig>) {
        super(null, httpClient);
    }

    public query(request: XmElasticSearchRepositoryQueryParamsPageable, headers?: HttpHeaders): Observable<HttpResponse<T[] & PageableAndSortable>> {
        const queryParams = this.getQueryParams(request as any);

        const params = this.getParams(queryParams as any);
        return this.handle(
            this.httpClient.post<T[] & HttpResponse<T[] & PageableAndSortable>>(this.url, params, {
                observe: 'response',
                headers,
            }).pipe(
                map(res => this.extractExtra(res, params)),
            ),
        );
    }

    protected override resourceUrl(): string {
        return this.config.resourceUrl;
    }

    protected getParams(params: XmElasticSearchRepositoryQueryParamsPageable): XmElasticSearchRepositoryRequest {
        const sortArr = Array.isArray(params.sortBy) ? params.sortBy : [params.sortBy];
        const sort = sortArr.map(item => ({ [`${item?.replace('_source.', '')}.keyword`]: params.sortOrder }));
        const extra: XmTableElasticSearchRepositoryExtra = {
            size: params.pageSize,
            from: params.pageIndex,
            sort,
        };

        let query: XmTableElasticSearchRepositoryQuery;
        if (params.query) {
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

        return res.clone({ body });
    }

    private getQueryParams(request: XmFilterQueryParams): QueryParamsPageable {
        const { pageableAndSortable, filterParams } = request;
        let queryParams = this.createQueryParams(pageableAndSortable, filterParams);
        if (this.config.paramsToRequest) {
            queryParams = this.createFiltersToRequest(queryParams);
        } else {
            queryParams = this.createElasticTypeFiltersToRequest(queryParams, filterParams);
        }
        return queryParams;
    }


    private getElastic(value: string | number, filter: { field: string, elasticType: string }): string {
        const fn = Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY[get(filter, 'elasticType', '')];
        return fn ? fn(value, filter) : null;
    }

    private createQueryParams(
        pageableAndSortable: PageableAndSortable,
        filterParams?: QueryParamsPageable
    ): QueryParamsPageable {
        const { pageIndex, pageSize, sortBy, sortOrder } = pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        };

        return _.merge(
            {},
            filterParams,
            pageParams,
        );
    }


    private createElasticTypeFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParams,
    ): QueryParamsPageable {
        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => {
                const configFilter = (this.configController.config.filters?.find(filter => key === filter.name) || {}) as XmTableConfigFilters;

                return this.getElastic(filterParams[key], {
                    field: key,
                    elasticType: configFilter['elasticType']
                });
            });

        const query = searchArr.join(' AND ');

        return _.merge(
            {},
            queryParams,
            {
                query
            },
        );
    }

    private createFiltersToRequest(
        queryParams: QueryParamsPageable,
    ): QueryParamsPageable {
        const filtersToRequest: { query: string } = xmFormatJs(this.config.paramsToRequest, { queryParams });
        return _.merge(
            {},
            queryParams,
            filtersToRequest,
        );
    }

}
