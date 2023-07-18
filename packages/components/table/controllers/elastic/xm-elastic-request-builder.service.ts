import { Injectable } from '@angular/core';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableConfig, XmTableConfigFilters } from '../../interfaces/xm-table.model';
import { XmFilterQueryParams } from '../collections/i-xm-table-collection-controller';
import {
    PageableAndSortable,
    QueryParamsPageable
} from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { get } from 'lodash';
import { QueryParams } from '@xm-ngx/repositories';
import { xmFormatJs } from '@xm-ngx/operators';
import {
    Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY
} from '../elastic/xm-table-filters-elastic-string-query';
import {
    XmElasticSearchRepositoryQueryParamsPageable,
    XmEntityRepositoryConfig
} from '../elastic/xm-elastic-search-repository.service';

@Injectable()
export class XmElasticRequestBuilder {

    constructor(private configController: XmTableConfigController<XmTableConfig>) {
    }

    protected config: XmEntityRepositoryConfig;

    public getQueryParams(request: XmFilterQueryParams, config: any): XmElasticSearchRepositoryQueryParamsPageable {
        this.config = _.cloneDeep(config);
        const { pageableAndSortable, filterParams } = request;
        let queryParams = this.createQueryParams(pageableAndSortable, filterParams);
        if (this.config.paramsToRequest) {
            queryParams = this.createFiltersToRequest(queryParams, this.config.useOnlySpecifiedParams);
        } else {
            queryParams = this.createElasticTypeFiltersToRequest(queryParams, filterParams);
        }
        return queryParams;
    }

    private createQueryParams(
        pageableAndSortable: PageableAndSortable,
        filterParams?: QueryParamsPageable,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const { pageIndex, pageSize, sortBy, sortOrder } = pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        };

        return _.merge(
            { query: '' },
            filterParams,
            pageParams,
        );
    }

    private createElasticTypeFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParams,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const typeKey = this.configController.config.collection?.repository?.config?.['query']?.['typeKey'];
        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => {
                const configFilter = (this.configController.config.filters?.find(filter => key === filter.name) || {}) as XmTableConfigFilters;
                return this.getElastic(filterParams[key], {
                    field: key,
                    elasticType: configFilter.options?.['elasticType']
                });
            });

        if (typeKey) {
            searchArr.push(`typeKey: ${typeKey}`);
        }
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
        skipMerge = false,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const filtersToRequest: { query: string } = xmFormatJs(this.config.paramsToRequest, { queryParams });

        if (skipMerge) {
            return filtersToRequest;
        }

        return _.merge(
            {},
            queryParams,
            filtersToRequest,
        );
    }

    private getElastic(value: string | number, filter: { field: string, elasticType: string }): string {
        const fn = Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY[get(filter, 'elasticType', '')];
        return fn ? fn(value, filter) : null;
    }

}
