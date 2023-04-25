import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    QueryParamsPageable
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import * as _ from 'lodash';
import { XM_TABLE_CONFIG_DEFAULT } from '@xm-ngx/components/table/interfaces/xm-table.model';

@Injectable()
export class XmTableQueryParamsStoreService {

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    public set(queryParams: QueryParamsPageable): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.getQueryParamsWithoutIgnoreValues(queryParams),
            },
        );

    }

    public get(): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        const pageAndSortKeys = Object.keys(_.merge(
            XM_TABLE_CONFIG_DEFAULT.pageableAndSortable,
            // this.config.pageableAndSortable,
        ));
        const separatedQueryParams = {
            pageAndSortQueryParams: {},
            filterQueryParams: {}
        };

        Object.keys(queryParams).forEach(key => {
            if (pageAndSortKeys.includes(key)) {
                separatedQueryParams.pageAndSortQueryParams[key] = queryParams[key];
            } else {
                separatedQueryParams.filterQueryParams[key] = queryParams[key];
            }
        });

        return queryParams;
    }

    private getQueryParamsWithoutIgnoreValues(queryParams: QueryParamsPageable, ignoreParams: string[] = ['query']) {
        return Object.keys(queryParams).reduce((acc, curr) => {
            if (!ignoreParams.includes(curr)) {
                acc[curr] = queryParams[curr];
            }
            return acc;
        }, {});
    }

}
