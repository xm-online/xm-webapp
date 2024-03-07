import { Injectable } from '@angular/core';
import { XmFilterQueryParams } from '../../collections/i-xm-table-collection-controller';
import { PageableAndSortable, QueryParams, QueryParamsPageable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { format, xmFormatJs } from '@xm-ngx/operators';
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

@Injectable(
    {providedIn: 'root'}
)
export class XmElasticRequestBuilder {

    protected config: XmEntityRepositoryConfig;

    public getQueryParams(request: XmFilterQueryParams, config: XmEntityRepositoryConfig): XmElasticSearchRepositoryQueryParamsPageable {
        this.config = _.cloneDeep(config);
        const { pageableAndSortable, filterParams, params } = request as XmFilterQueryParams & { params: QueryParams };
        let queryParams = this.createQueryParams(pageableAndSortable, filterParams);
        if (this.config.format) {
            queryParams = this.createFormatFiltersToRequest(queryParams, filterParams);
        }
        else if (this.config.paramsToRequest) {
            queryParams = this.createFiltersToRequest(queryParams, this.config.useOnlySpecifiedParams);
        }
        else if (this.config.filtersToQuery){
            queryParams = this.createElasticTypeFiltersToRequest(queryParams, filterParams);
        }
        else if (params) {
            queryParams = _.merge(queryParams, params);
        } else {
            queryParams = this.createDefaultFiltersToRequest(queryParams, filterParams);
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
        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => this.getElastic(key, filterParams[key]));

        return this.buildParamsWithElasticQuery(queryParams, searchArr);
    }

    private createDefaultFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParams,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => `${key}: ${filterParams[key]}`);

        return this.buildParamsWithElasticQuery(queryParams, searchArr);
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

    private createFormatFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParams,
    ): XmElasticSearchRepositoryQueryParamsPageable {
        const formattedObj = format(this.config.format?.query, filterParams);
        const searchArr = Object.keys(formattedObj)
            .filter(key => !_.isEmpty(formattedObj[key]))
            .map(key => `${key}: ${formattedObj[key]}`);

        return this.buildParamsWithElasticQuery(queryParams, searchArr);
    }

    private getElastic(key: string, value: unknown): string {
        const configFilter = this.config.filtersToQuery[key] || { field: key, elasticType: '' };
        const elasticType = configFilter.elasticType || '';
        const fn = Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY[elasticType];
        return fn ? fn(value, configFilter) : null;
    }

    private buildParamsWithElasticQuery(queryParams: QueryParamsPageable, searchArr: string[]): XmElasticSearchRepositoryQueryParamsPageable {
        const typeKey = this.config.query?.typeKey;

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
}
