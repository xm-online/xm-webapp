import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/components/entity-collection';
import { formatWithConfig } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/format';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { take } from 'rxjs/operators';
import {
    IXmTableCollectionController, XmTableConfigController,
    XmTableEntityController,
} from '@xm-ngx/components/table/table';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { lastValueFrom } from 'rxjs';
import {
    XmTableRepositoryResolver,
} from '@xm-ngx/components/table/table/repositories/xm-table-repository-resolver.service';
import { cloneDeep } from 'lodash';
import {
    AXmTableStateCollectionController
} from '@xm-ngx/components/table/table/controllers/collections/a-xm-table-state-collection-controller.service';

export interface QueryArrayOnlyViewConfig {
    format2: string,
    resourceUrl: string,
    resourceHandleKey: string,
}

@Injectable()
export class XmTableReadOnlyRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public config: QueryArrayOnlyViewConfig;
    private repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public entity: object;

    constructor(
        private configController: XmTableConfigController<QueryArrayOnlyViewConfig>,
        private entityController: XmTableEntityController<object>,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = await lastValueFrom(this.configController.config$());
        this.entity = await lastValueFrom(this.entityController.entity$());
        this.repository = this.repositoryResolver.get(this.config.resourceHandleKey);
        const query: object = formatWithConfig(this.entity, { format2: this.config.format2 });

        this.changePartial({ loading: true });
        this.repository
            .query(query)
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
        throw new NotSupportedException();
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
