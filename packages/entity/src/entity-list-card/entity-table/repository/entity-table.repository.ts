import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PageableAndSortable, XmRepositoryConfig } from '@xm-ngx/repositories';
import { Extra, XmEntity } from '@xm-ngx/core/entity';
import { Injectable, inject } from '@angular/core';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { XmElasticRequestBuilder, XmEntityRepository, XmEntityRepositoryQuery, XmFilterQueryParams } from '@xm-ngx/components/table';
import { Observable, map } from 'rxjs';
import { isEmpty } from 'lodash';
import { ActivatedRoute } from '@angular/router';

export interface XmEntityTableQueryParams extends XmFilterQueryParams { 
    filterParams: {
        fastSearch?: string;
    }
}

export type XmEntityTableQuery = XmEntityRepositoryQuery & { typeKey?: string; query: string; }

@Injectable()
export class XmEntityTableRepository<T extends XmEntity> extends XmEntityRepository<T> implements XmDynamicService<XmRepositoryConfig> {
    private route = inject(ActivatedRoute);
    
    constructor(httpClient: HttpClient, requestBuilder: XmElasticRequestBuilder) {
        super(httpClient, requestBuilder);
    }

    public query(filterQueryParams: XmFilterQueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        const searchParams = this.buildSearchParams(filterQueryParams);

        if (searchParams != null) {
            return this.searchQuery(searchParams);
        }

        return super.query(filterQueryParams);
    }

    private buildSearchParams(filterQueryParams: XmFilterQueryParams): XmEntityTableQuery {
        const params = super.getParams(filterQueryParams) as XmEntityTableQuery;

        if (filterQueryParams?.filterParams?.fastSearch) {
            return params;
        }

        // Support url with ?query=entityId&dashboardId=compaing
        const searchQuery = this.route.snapshot.queryParamMap.get('query');
        const isSearchQuery = !isEmpty(searchQuery) && isEmpty(params.typeKey);

        if (isSearchQuery) {
            return {
                ...(params ?? {}),
                query: searchQuery,
            } as XmEntityTableQuery;
        }

        return null;
    }

    private searchQuery(params: XmEntityRepositoryQuery, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        return this.handle(
            this.httpClient.get<T[] & Extra>('entity/api/_search/v2/xm-entities', { params, observe: 'response', headers }).pipe(
                map(res => super.extractExtra(res, params)),
            ),
        );
    }
}
