import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageableAndSortable, QueryParamsPageable } from '@xm-ngx/repositories';
import { format } from '@xm-ngx/operators';
import { get, isEmpty, merge, omitBy, set } from 'lodash';
import {
    XmTableQueryParamsToFilter,
    XmTableWithColumnDynamicCellOptionsPagination
} from '../../table-widget/xm-table-widget.config';
import { flattenObjectDeep, unFlattenObjectDeep } from '@xm-ngx/operators/src/flattenObjectDeep';

@Injectable()
export class XmTableQueryParamsStoreService {

    private _key: string;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    public set key(key: string) {
        this._key = key;
    }
    public get key(): string {
        return this._key;
    }


    public set(queryParams: QueryParamsPageable, config: any): void {
        const clearPageableAndSortable = this.removeEmptyFields(queryParams.pageableAndSortable, config.pageableAndSortable);

        const removeFiltersFieldsQueryParams = Object.keys(config.queryParamsToFillter ?? {})
            .reduce((acc, key) => ({...acc, [key]: null}), {}) ?? {};
        const deleteParams = this.getNullubleQueryParams();

        const clearedQueryParams = merge({},
            {pageableAndSortable: clearPageableAndSortable},
            {filterParams: queryParams.filterParams});

        const flattenedParams = flattenObjectDeep(clearedQueryParams, this.key + '_');

        const finalQuery = {
            ...removeFiltersFieldsQueryParams,
            ...deleteParams,
            ...flattenedParams,
        };

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: finalQuery,
                queryParamsHandling: 'merge',
            },
        );
    }

    private getNullubleQueryParams(): { [key: string]: null } {
        const currentParams = this.activatedRoute.snapshot.queryParams;
        const deleteParams = {};
        for (const currentParamsKey in currentParams) {
            if (currentParamsKey.startsWith(this.key + '_')) {
                deleteParams[currentParamsKey] = null;
            }
        }
        return deleteParams;
    }


    public get(queryParamsToFillter?: XmTableQueryParamsToFilter): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const unflattenQueryParams = unFlattenObjectDeep(queryParams, this.key + '_');

        if (!isEmpty(queryParamsToFillter)) {
            const queryParamsFilter= omitBy(format(queryParamsToFillter ?? {}, queryParams) ?? {}, isEmpty);
            const jsonFilterParams = get(unflattenQueryParams, 'filterParams', {}) as object;
            const preferFilterParams = merge({}, queryParamsFilter, jsonFilterParams);

            set(unflattenQueryParams, 'filterParams', preferFilterParams);
        }

        return unflattenQueryParams;
    }


    public removeEmptyFields(pageableAndSortable: PageableAndSortable, configParams: XmTableWithColumnDynamicCellOptionsPagination): PageableAndSortable {
        const keysToCheck: string[] = ['pageIndex', 'pageSize', 'sortBy', 'sortOrder'];
        const changedValues: PageableAndSortable = {};
        keysToCheck.forEach((key: string) => {
            if (configParams[key].toString() !== pageableAndSortable[key].toString()) {
                changedValues[key] = pageableAndSortable[key];
            }
        });
        return changedValues;
    }
}
