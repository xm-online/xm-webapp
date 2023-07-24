import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsPageable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmTableQueryParamsToFilter } from '../../interfaces/xm-table.model';
import { format } from '@xm-ngx/shared/operators';
import { isEmpty, set, get, merge, isString, omitBy } from 'lodash';
import { XmFilterQueryParams } from '../collections/i-xm-table-collection-controller';

@Injectable()
export class XmTableQueryParamsStoreService {

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    public set(queryParams: QueryParamsPageable, removeFieldsFromUrl?: Record<string, string>): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: { 
                    ...(removeFieldsFromUrl ?? {}),
                    json: JSON.stringify(queryParams) 
                },
                queryParamsHandling: 'merge'
            },
        );

    }

    public get(queryParamsToFillter?: XmTableQueryParamsToFilter): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const jsonString = queryParams?.json as string;

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
