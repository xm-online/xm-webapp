import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsPageable } from '@xm-ngx/repositories';

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
                queryParams: { json: JSON.stringify(queryParams) },
                queryParamsHandling: 'merge'
            },
        );

    }

    public get(): QueryParamsPageable {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        return JSON.parse(queryParams?.json || '{}') as QueryParamsPageable;
    }

}
