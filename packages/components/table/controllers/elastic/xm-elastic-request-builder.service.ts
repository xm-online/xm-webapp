import { Injectable } from '@angular/core';
import { XmFilterQueryParams } from '../../collections/i-xm-table-collection-controller';
import { PageableAndSortable, QueryParams, QueryParamsPageable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { xmFormatJs } from '@xm-ngx/operators';
import {
    XmElasticSearchRepositoryQueryParamsPageable,
    XmEntityRepositoryConfig
} from '../elastic/xm-elastic-search-repository.service';

import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { Translate } from '@xm-ngx/translation';
import { Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY } from './xm-table-filters-elastic-string-query';

export interface XmTableConfigFilters extends FormGroupLayoutItem {
    options: {
        title: Translate,
    }
}

@Injectable()
export class XmElasticRequestBuilder {

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
        const typeKey = this.config.query.typeKey;

        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => this.getElastic(key, filterParams[key]));

        if (typeKey) {
            searchArr.push(`typeKey: ${typeKey}`);
        }
        const query = searchArr.join(' AND ');

        return _.merge(
            {},
            queryParams,
            {
                query,
            },
        );
    }

    private createFiltersToRequest(
        queryParams: QueryParamsPageable,
        skipMerge = false,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const filtersToRequest = xmFormatJs(this.config.paramsToRequest, { queryParams });
        const mergeFilters = _.merge(
            {},
            skipMerge
                ? {}
                : queryParams,
            filtersToRequest,
        );

        return _.omitBy(mergeFilters, _.isEmpty) as { query: string };
    }

    private getElastic(key: string, value: unknown): string {
        const configFilter = this.config.filtersToQuery[key] || { field: key, elasticType: '' };
        const elasticType = configFilter.elasticType || '';
        const fn = Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY[elasticType];
        return fn ? fn(value, configFilter) : null;
    }

}
