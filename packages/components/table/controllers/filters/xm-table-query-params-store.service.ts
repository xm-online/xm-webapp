import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageableAndSortable, QueryParamsPageable } from '@xm-ngx/repositories';
import { get, merge } from 'lodash';
import {
    XmTableQueryParamsFilter,
    XmTableWithColumnDynamicCellOptionsPagination,
} from '../../table-widget/xm-table-widget.config';
import { flattenObjectDeep, unFlattenObjectDeep } from '@xm-ngx/operators';
import { XmTableConfig } from '../../directives/xm-table.model';
import { Observable, map, BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable()
export class XmTableQueryParamsStoreService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private queryParamsSub: BehaviorSubject<QueryParamsPageable> = new BehaviorSubject(null as QueryParamsPageable);

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

        this.queryParamsSub.next(queryParams);

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
            distinctUntilChanged((prev, curr) => {
                const keys = Object.keys(queryParamsFilter ?? {});

                if (keys.length === 0) {
                    return true;
                }

                const changedKeys = keys.filter((key) => prev[key] !== curr[key]);

                // Keys changed, so allow emission
                if (changedKeys.length > 0) {
                    return false;
                }

                return true;
            }),
            map((queryParams) => {
                return Object.entries(queryParamsFilter ?? {})
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
            }),
        );
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

    public getQueryParamsValue(): QueryParamsPageable {
        return this.queryParamsSub.getValue();
    }
}
