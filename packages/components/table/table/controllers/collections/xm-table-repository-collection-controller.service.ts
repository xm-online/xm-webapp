import { Injectable } from '@angular/core';
import { IEntityCollectionPageable, QueryParamsPageable, } from '@xm-ngx/components/entity-collection';
import { firstValueFrom } from 'rxjs';
import { IXmTableCollectionController, } from './i-xm-table-collection-controller';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

import { cloneDeep } from 'lodash';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableRepositoryResolver, } from '../repositories/xm-table-repository-resolver.service';
import { XmTableRepositoryCollectionConfig, } from './xm-table-read-only-repository-collection-controller';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import { XmTableConfig } from '../../interfaces/xm-table.model';

@Injectable()
export class XmTableRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public config: XmTableRepositoryCollectionConfig;
    public entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableConfig>,
        // private entityController: XmTableEntityController<object>,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(pageableAndSortable: QueryParamsPageable | null): Promise<void> {
        if (pageableAndSortable == null) {
            pageableAndSortable = PAGEABLE_AND_SORTABLE_DEFAULT;
        }
        const tableConfig = await firstValueFrom(this.configController.config$());
        this.config = tableConfig.collection.repository;

        // TODO: replace entity with query
        // this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = this.repositoryResolver.get(this.config.resourceHandleKey, this.config.resourceUrl);

        // const query: object = formatWithConfig(this.entity, { format2: this.config.query });

        this.changePartial({ loading: true, pageableAndSortable: pageableAndSortable });

        this.repository
            .query({ ...this.config.query, ...pageableAndSortable })
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
}
