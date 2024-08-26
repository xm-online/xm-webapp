import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageableAndSortable, QueryParamsPageable } from '@xm-ngx/repositories';
import { get, isFunction, merge } from 'lodash';
import {
    XmTableQueryParamsFilter,
    XmTableQueryParamsFilterValue,
    XmTableWithColumnDynamicCellOptionsPagination,
} from '../../table-widget/xm-table-widget.config';
import { flattenObjectDeep, unFlattenObjectDeep } from '@xm-ngx/operators';
import { XmTableConfig } from '../../directives/xm-table.model';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable, map, of } from 'rxjs';

@Injectable()
export class XmTableQueryParamsStoreService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private _key: string;

    public set key(key: string) {
        this._key = key;
    }

    public get key(): string {
        return this._key;
    }

    public set(queryParams: QueryParamsPageable, config: XmTableConfig): void {
        const clearPageableAndSortable = this.removeEmptyFields(queryParams.pageableAndSortable, config.pageableAndSortable);

        const deleteParams = this.getNullubleQueryParams();

        const clearedQueryParams = merge({},
            {pageableAndSortable: clearPageableAndSortable},
            {filterParams: queryParams.filterParams});

        const flattenedParams = flattenObjectDeep(clearedQueryParams, this.key + '_');

        const finalQuery = {
            ...deleteParams,
            ...flattenedParams,
        };

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: finalQuery,
                queryParamsHandling: 'merge',
                replaceUrl: config?.navigation?.replaceUrl,
            },
        );
    }

    private getNullubleQueryParams(): { [key: string]: null } {
        const currentParams = this.route.snapshot.queryParams;
        const deleteParams = {};
        for (const currentParamsKey in currentParams) {
            if (currentParamsKey.startsWith(this.key + '_')) {
                deleteParams[currentParamsKey] = null;
            }
        }
        return deleteParams;
    }

    public listenQueryParamsToFilter(queryParamsFilter?: XmTableQueryParamsFilter): Observable<Params> {
        return this.route.queryParams.pipe(
            map((queryParams) => {
                return this.filterParams(
                    queryParams,
                    queryParamsFilter,
                    (filter) => coerceBooleanProperty(filter.update),
                );
            }),
        );
    }

    public queryParamsToFilter(queryParamsFilter?: XmTableQueryParamsFilter): Observable<Params> {
        return of(this.route.snapshot.queryParams).pipe(
            map((queryParams) => {
                return this.filterParams(queryParams, queryParamsFilter);
            }),
        );
    }

    public filterParams(
        queryParams: Params,
        queryParamsFilter: XmTableQueryParamsFilter,
        queryParamsCriteria?: (value: XmTableQueryParamsFilterValue) => boolean,
    ): Params {
        return Object.entries(queryParamsFilter ?? {})
            .filter(([, filter]) => {
                if (isFunction(queryParamsCriteria)) {
                    return queryParamsCriteria(filter);
                }

                return true;
            })
            .reduce((acc, [key, filter]) => {
                const param = queryParams[key] as string;

                if (!param) {
                    return acc;
                }

                return {
                    ...acc,
                    [filter.name]: param,
                };
            }, this.getByKey('filterParams'));
    }

    public get(): QueryParamsPageable {
        const queryParams = this.route.snapshot.queryParams;
        return unFlattenObjectDeep(queryParams, this.key + '_');
    }

    public getByKey(key: string | string[]): QueryParamsPageable {
        const unflattenQueryParams = this.get();
        return get(unflattenQueryParams, key, {}) as QueryParamsPageable;
    }

    public removeEmptyFields(pageableAndSortable: PageableAndSortable, configParams: XmTableWithColumnDynamicCellOptionsPagination): PageableAndSortable {
        const keysToCheck: string[] = ['pageIndex', 'pageSize', 'sortBy', 'sortOrder'];
        const changedValues: PageableAndSortable = {};
        keysToCheck.forEach((key: string) => {
            if (configParams[key] !== undefined && pageableAndSortable[key] !== undefined && configParams[key]?.toString() !== pageableAndSortable[key]?.toString()) {
                changedValues[key] = pageableAndSortable[key];
            }
        });
        return changedValues;
    }
}
