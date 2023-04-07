import { Injectable } from '@angular/core';
import { IEntityCollectionPageable, QueryParamsPageable, } from '@xm-ngx/components/entity-collection';
import { firstValueFrom } from 'rxjs';
import { FilterQueryParams, IXmTableCollectionController, } from './i-xm-table-collection-controller';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

import { cloneDeep, get } from 'lodash';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableRepositoryResolver, } from '../repositories/xm-table-repository-resolver.service';
import { XmTableRepositoryCollectionConfig, } from './xm-table-read-only-repository-collection-controller';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import { XmTableConfig } from '../../interfaces/xm-table.model';
import { QueryParams } from '@xm-ngx/ext/common-webapp-ext/utils';
import { format } from '@xm-ngx/shared/operators';
import * as _ from 'lodash';
import { TABLE_FILTERS_ELASTIC } from '@xm-ngx/ext/common-webapp-ext/table-filter';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class XmTableRepositoryCollectionController<T = unknown>
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
        // TODO: replace entity with query
        // this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = this.repositoryResolver.get(repositoryConfig.resourceHandleKey, repositoryConfig.resourceUrl);

        const queryParams = this.getQueryParams(request);

        this.changePartial({ loading: true, pageableAndSortable: queryParams });

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams,
            },
        );

        this.repository
            .query({ ...repositoryConfig.query, ...queryParams })
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
        this.changePartial({ loading: true });
        this.repository.update(curr)
            .subscribe(
                (_) => this.changePartial({ loading: false }),
                () => this.changePartial({ loading: false }),
                () => this.changePartial({ loading: false }));
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
        filterParams: QueryParamsPageable
    ): QueryParams & PageableAndSortable {
        const filtersToRequest: { query: string } = format(this.config.filtersToRequest, filterParams);
        return _.merge(
            {},
            queryParams,
            filtersToRequest,
        );
    }

    private createElasticTypeFiltersToRequest(
        queryParams: QueryParamsPageable,
        filterParams: QueryParamsPageable
    ): QueryParams & PageableAndSortable {
        const typeKey = this.config.collection?.repository?.query?.typeKey;
        const searchArr = _.filter(this.config.filters, item => !_.isEmpty(filterParams[item.name]))
            .map((item) => {
                return item.options?.elasticType === 'chips'
                    ? `${filterParams[item.name]?.join(' AND ')}`
                    : this.getElastic(filterParams[item.name], {
                        field: item.name,
                        elasticType: item.options?.elasticType
                    });
            });

        if (typeKey) {
            searchArr.push(`typeKey: ${typeKey}`);
        }
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
        filterParams: QueryParamsPageable
    ): QueryParams & PageableAndSortable {
        const {pageIndex, pageSize, sortBy, sortOrder} = pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder
        };

        return _.merge(
            {},
            pageParams,
            filterParams,
        );
    }

    private getQueryParams(request: FilterQueryParams): QueryParamsPageable {
        const {pageableAndSortable, filterParams} = request;
        let queryParams = this.createQueryParams(pageableAndSortable, filterParams);
        if (this.config.filtersToRequest) {
            queryParams = this.createFiltersToRequest(queryParams, filterParams);
        } else {
            queryParams = this.createElasticTypeFiltersToRequest(queryParams, filterParams);
        }
        return queryParams;
    }

    private getElastic (value: string | number, filter: { field: string, elasticType: string }): (
        value: string | number, filter: { field: string, elasticType: string }
    ) => string {
        const fn = TABLE_FILTERS_ELASTIC[get(filter, 'elasticType', '')];
        return fn ? fn(value, filter) : null;
    };
}
