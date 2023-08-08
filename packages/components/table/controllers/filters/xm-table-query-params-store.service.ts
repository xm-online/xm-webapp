import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsPageable } from '@xm-ngx/repositories';
import { format } from '@xm-ngx/operators';
import { isEmpty, set, get, merge, isString, omitBy } from 'lodash';
import { XmFilterQueryParams } from '../collections/i-xm-table-collection-controller';
import { XmTableQueryParamsToFilter } from '../../table-widget/xm-table-widget.config';

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

    public set(queryParams: QueryParamsPageable, removeFieldsFromUrl?: Record<string, string>): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: {
                    ...(removeFieldsFromUrl ?? {}),
                    [this.key]: JSON.stringify(queryParams)
                },
                queryParamsHandling: 'merge'
            },
        );

    }

    public get(queryParamsToFillter?: XmTableQueryParamsToFilter): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const jsonString = queryParams?.[this.key] as string;

        const jsonParams = (isString(jsonString) && !isEmpty(jsonString)
            ? JSON.parse(jsonString)
            : {}
        ) as (XmFilterQueryParams | object);

        if (!isEmpty(queryParamsToFillter)) {
            const queryParamsFilter= omitBy(format(queryParamsToFillter ?? {}, queryParams) ?? {}, isEmpty);
            const jsonFilterParams = get(jsonParams, 'filterParams', {}) as object;
            const preferFilterParams = merge({}, queryParamsFilter, jsonFilterParams);

            set(jsonParams, 'filterParams', preferFilterParams);
        }

        return jsonParams;
    }

}
