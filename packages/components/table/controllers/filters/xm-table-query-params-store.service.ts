import { Injectable } from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { PageableAndSortable, QueryParamsPageable } from '@xm-ngx/repositories';
import { format } from '@xm-ngx/operators';
import { get, isEmpty, merge, omitBy, set } from 'lodash';
import {
    XmTableQueryParamsToFilter,
    XmTableWithColumnDynamicCellOptionsPagination
} from '../../table-widget/xm-table-widget.config';
import { flattenObjectWithArray, unflattenObjectWithKey } from '@xm-ngx/operators/src/flattenObjectWithArray';

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


    public set(queryParams: QueryParamsPageable, removeFieldsFromUrl?: Record<string, string>, queryParamsHandling: QueryParamsHandling = 'merge'): void {
        const currentParams = this.activatedRoute.snapshot.queryParams;
        const deleteparams = {};
        for (const currentParamsKey in currentParams) {
            if (currentParamsKey.startsWith(this.key + '_')) {
                deleteparams[currentParamsKey] = null;
            }
        }
        const flattenedParams = flattenObjectWithArray(queryParams, this.key + '_');
        const finalQuery = {
            ...(removeFieldsFromUrl ?? {}),
            ...deleteparams,
            ...flattenedParams,
        };

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: finalQuery,
                queryParamsHandling: queryParamsHandling,
            },
        );
    }


    public get(queryParamsToFillter?: XmTableQueryParamsToFilter): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const unflattenQueryParams = unflattenObjectWithKey(queryParams, this.key + '_');

        if (!isEmpty(queryParamsToFillter)) {
            const queryParamsFilter= omitBy(format(queryParamsToFillter ?? {}, queryParams) ?? {}, isEmpty);
            const jsonFilterParams = get(unflattenQueryParams, 'filterParams', {}) as object;
            const preferFilterParams = merge({}, queryParamsFilter, jsonFilterParams);

            set(unflattenQueryParams, 'filterParams', preferFilterParams);
        }

        return unflattenQueryParams;
    }


    public checkPageableAndSortable(pageableAndSortable: PageableAndSortable, configParams: XmTableWithColumnDynamicCellOptionsPagination): PageableAndSortable {
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
