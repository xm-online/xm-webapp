import { Injectable } from '@angular/core';
import { IEntityCollectionPageable, QueryParams, QueryParamsPageable, } from '@xm-ngx/components/entity-collection';
import { firstValueFrom } from 'rxjs';
import { FilterQueryParams, IXmTableCollectionController, } from './i-xm-table-collection-controller';

import { cloneDeep, get } from 'lodash';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableRepositoryResolver, } from '../repositories/xm-table-repository-resolver.service';
import { XmTableRepositoryCollectionConfig, } from './xm-table-read-only-repository-collection-controller';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import {
    XmTableConfig,
    XmTableConfigFilters
} from '../../interfaces/xm-table.model';
import { format } from '@xm-ngx/shared/operators';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TABLE_FILTERS_ELASTIC } from '../filters/xm-table-filter-const';
import { PageableAndSortable, PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

@Injectable()
export class XmTableElasticSearchCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public config: XmTableConfig;
    public entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableConfig>,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        super();
    }

    public async load(request: FilterQueryParams): Promise<void> {
        if (_.isEmpty(request.pageableAndSortable)) {
            request.pageableAndSortable = PAGEABLE_AND_SORTABLE_DEFAULT;
        }
        this.config = await firstValueFrom(this.configController.config$());
        const repositoryConfig: XmTableRepositoryCollectionConfig = this.config.collection.repository;
        this.repository = this.repositoryResolver.get(repositoryConfig.resourceHandleKey, repositoryConfig.resourceUrl);

        const queryParams = this.getQueryParams(request);

        this.changePartial({loading: true, pageableAndSortable: queryParams});

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.getQueryParamsWithoutIgnoreValues(queryParams),
            },
        );

        this.repository
            .query({...repositoryConfig.query, ...queryParams})
            .pipe(take(1))
            .subscribe(
                (res) => {
                    this.change({
                        loading: false,
                        items: res.body,
                        pageableAndSortable: {
                            total: res.body.total,
                            pageSize: res.body.pageSize,
                            pageIndex: res.body.pageIndex,
                            sortBy: res.body.sortBy,
                            sortOrder: res.body.sortOrder,
                        },
                        error: null,
                    });
                },
                error => {
                    this.change({
                        loading: false,
                        items: [],
                        pageableAndSortable: cloneDeep(PAGEABLE_AND_SORTABLE_DEFAULT),
                        error: error,
                    });
                });
    }

    public add(item: T): void {
        throw new NotSupportedException();
    }

    public edit(prev: T, curr: T): void {
        this.changePartial({loading: true});
        this.repository.update(curr)
            .subscribe(
                (_) => this.changePartial({loading: false}),
                () => this.changePartial({loading: false}),
                () => this.changePartial({loading: false}));
    }

    public remove(item: T): void {
        throw new NotSupportedException();
    }

    public reset(): void {
        this.load(null);
    }

    public save(): void {
        throw new NotSupportedException();
    }

    private createFiltersToRequest(
        queryParams: QueryParamsPageable,
    ): QueryParamsPageable {
        const filtersToRequest: { query: string } = format(this.config.filtersToRequest, queryParams);
        return _.merge(
            {},
            queryParams,
            filtersToRequest,
        );
    }

    private createElasticTypeFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParams,
    ): QueryParamsPageable {
        const searchArr = Object.keys(filterParams)
            .filter(key => !_.isEmpty(filterParams[key]))
            .map(key => {
                const configFilter = this.config.filters?.find(filter => key === filter.name) || {} as XmTableConfigFilters;
                return this.getElastic(filterParams[key], {
                    field: key,
                    elasticType: configFilter.options?.elasticType
                });
            });

        const query = searchArr.join(' AND ');

        return _.merge(
            {},
            queryParams,
            {
                query
            },
        );
    }

    private createQueryParams(
        pageableAndSortable: PageableAndSortable,
        filterParams?: QueryParamsPageable
    ): QueryParamsPageable {
        const {pageIndex, pageSize, sortBy, sortOrder} = pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder
        };

        return _.merge(
            {},
            filterParams,
            pageParams,
        );
    }

    private getQueryParams(request: FilterQueryParams): QueryParamsPageable {
        const {pageableAndSortable, filterParams} = request;
        let queryParams = this.createQueryParams(pageableAndSortable, filterParams);
        if (this.config.filtersToRequest) {
            queryParams = this.createFiltersToRequest(queryParams);
        } else {
            queryParams = this.createElasticTypeFiltersToRequest(queryParams, filterParams);
        }
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

    private getElastic(value: string | number, filter: { field: string, elasticType: string }): string {
        const fn = TABLE_FILTERS_ELASTIC[get(filter, 'elasticType', '')];
        return fn ? fn(value, filter) : null;
    };
}
