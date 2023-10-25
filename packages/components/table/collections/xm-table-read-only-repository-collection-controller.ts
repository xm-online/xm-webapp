import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/repositories';

import { NotSupportedException } from '@xm-ngx/exceptions';
import { take } from 'rxjs/operators';

import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/repositories';
import { firstValueFrom } from 'rxjs';
import { XmTableRepositoryResolver, } from '../repositories/xm-table-repository-resolver.service';
import { cloneDeep } from 'lodash';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { IXmTableCollectionController, XmFilterQueryParams } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../controllers/entity/xm-table-entity-controller.service';
import { xmFormatJs } from '@xm-ngx/operators';
import { IXmTableRepositoryCollectionControllerConfig } from './xm-table-repository-collection-controller.service';

export interface XmTableReadOnlyRepositoryCollectionControllerConfig extends IXmTableRepositoryCollectionControllerConfig {
    type: 'readOnlyRepository',
}

@Injectable()
export class XmTableReadOnlyRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public declare config: XmTableReadOnlyRepositoryCollectionControllerConfig;
    public entity: object;
    private repository: IEntityCollectionPageable<T, PageableAndSortable>;

    constructor(
        private entityController: XmTableEntityController<object>,
        private repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = await this.repositoryResolver.get(this.config.repository);
        const query: object = xmFormatJs(this.config.filtersToRequest, { entity: request });

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
