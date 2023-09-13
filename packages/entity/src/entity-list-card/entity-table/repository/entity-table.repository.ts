import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PageableAndSortable, XmRepositoryConfig } from '@xm-ngx/repositories';
import { Extra, XmEntity } from '@xm-ngx/core/entity';
import { Injectable } from '@angular/core';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { XmElasticRequestBuilder, XmEntityRepository, XmEntityRepositoryQuery, XmFilterQueryParams } from '@xm-ngx/components/table';
import { Observable, map } from 'rxjs';

export interface XmEntityTableQueryParams extends XmFilterQueryParams { 
    filterParams: {
        fastSearch?: string;
    }
}

@Injectable()
export class XmEntityTableRepository<T extends XmEntity> extends XmEntityRepository<T> implements XmDynamicService<XmRepositoryConfig> {
    constructor(httpClient: HttpClient, requestBuilder: XmElasticRequestBuilder) {
        super(httpClient, requestBuilder);
    }

    public query(filterQueryParams: XmFilterQueryParams): Observable<HttpResponse<T[] & PageableAndSortable>> {
        const tableParams = filterQueryParams as XmEntityTableQueryParams;

        if (tableParams?.filterParams?.fastSearch) {
            return this.searchQuery(filterQueryParams);
        }

        return super.query(filterQueryParams);
    }

    private searchQuery(filterQueryParams: XmFilterQueryParams, headers?: HttpHeaders): Observable<HttpResponse<T[] & Extra>> {
        const params = super.getParams(filterQueryParams) as XmEntityRepositoryQuery;

        return this.handle(
            this.httpClient.get<T[] & Extra>('entity/api/_search/v2/xm-entities', { params, observe: 'response', headers }).pipe(
                map(res => super.extractExtra(res, params)),
            ),
        );
    }
}
