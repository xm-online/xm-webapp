import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsPageable } from '@xm-ngx/repositories';
import { format } from '@xm-ngx/operators';
import { isEmpty, set, get, merge, isString, omitBy } from 'lodash';
import { XmFilterQueryParams } from '../../collections/i-xm-table-collection-controller';
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
        const flattenedParams = this.flattenJson(queryParams);

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: {
                    ...(removeFieldsFromUrl ?? {}),
                    ...flattenedParams,
                },
                queryParamsHandling: 'merge',
            },
        );
    }

    private flattenJson(data: QueryParamsPageable, parentKey: string = '', result: FlattenedType = {}): FlattenedType {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const propName = parentKey ? parentKey + '.' + key : key;
                if (typeof data[key] === 'object') {
                    this.flattenJson(data[key], propName, result);
                } else {
                    result[propName] = data[key];
                }
            }
        }
        return result;
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
type FlattenedType = Record<string, string | number | boolean>;
