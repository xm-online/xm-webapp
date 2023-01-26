import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/components/entity-collection';
import { formatWithConfig } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/format';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { take } from 'rxjs/operators';

import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { firstValueFrom } from 'rxjs';
import {
    XmTableRepositoryResolver,
} from '../../repositories/xm-table-repository-resolver.service';
import { cloneDeep } from 'lodash';
import {
    AXmTableStateCollectionController
} from './a-xm-table-state-collection-controller.service';
import { XmTableConfig } from '../../interfaces/xm-table.model';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';

export interface XmTableRepositoryCollectionConfig {
    query: { [key: string]: string },
    resourceUrl: string,
    resourceHandleKey: string,
}

@Injectable()
export class XmTableReadOnlyRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public config: XmTableRepositoryCollectionConfig;
    private repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableConfig>,
        private entityController: XmTableEntityController<object>,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = (await firstValueFrom(this.configController.config$())).collection.repository;
        this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = this.repositoryResolver.get(this.config.resourceHandleKey, this.config.resourceUrl);
        const query: object = formatWithConfig(this.entity, { format2: this.config.query });

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
