import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/components/entity-collection';

import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { take } from 'rxjs/operators';

import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { firstValueFrom } from 'rxjs';
import { XmTableRepositoryResolver, } from '@xm-ngx/components/table/repositories/xm-table-repository-resolver.service';
import { cloneDeep } from 'lodash';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { XmTableConfig } from '../../interfaces/xm-table.model';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';
import { xmFormatJs, XmFormatJsTemplateRecursive } from '@xm-ngx/shared/operators';

export interface XmTableRepositoryCollectionConfig {
    config: {
        filtersToRequest: XmFormatJsTemplateRecursive,
        resourceUrl: string,
    },
    selector: string,
}

@Injectable()
export class XmTableReadOnlyRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public config: XmTableRepositoryCollectionConfig;
    public entity: object;
    private repository: IEntityCollectionPageable<T, PageableAndSortable>;

    constructor(
        private configController: XmTableConfigController<XmTableConfig>,
        private entityController: XmTableEntityController<object>,
        private repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = (await firstValueFrom(this.configController.config$())).collection.repository;
        this.entity = await firstValueFrom(this.entityController.entity$());
        this.repository = await this.repositoryResolver.get();
        const query: object = xmFormatJs(this.config.config.filtersToRequest,{entity: request});

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
