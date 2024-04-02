import { Injectable } from '@angular/core';
import { XmFilterQueryParams } from '../../collections/i-xm-table-collection-controller';
import { QueryParams, QueryParamsPageable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { format } from '@xm-ngx/operators';
import {
    XmEntityRepositoryConfig
} from '../elastic/xm-elastic-search-repository.service';

@Injectable(
    {providedIn: 'root'}
)
export class XmRepositoryRequestBuilder {
    protected config: XmEntityRepositoryConfig;

    public getQueryParams(request: XmFilterQueryParams, config: XmEntityRepositoryConfig): {
        request: QueryParamsPageable,
        query: QueryParamsPageable
    } {
        this.config = _.cloneDeep(config);
        const {pageableAndSortable, filterParams} = request as XmFilterQueryParams & { params: QueryParams };

        const params = {
            ...pageableAndSortable,
        };
        const filtersToRequest = this.config.format ?
            _.pickBy(
                format<Record<string, any>>(this.config.format?.query, filterParams),
                v => v !== null && v !== undefined && v !== ''
            ) : filterParams;

        return {
            request: _.merge(params, filtersToRequest),
            query: filtersToRequest
        };
    }
}
