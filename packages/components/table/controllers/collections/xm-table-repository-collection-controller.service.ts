import { Injectable } from '@angular/core';
import { IEntityCollectionPageable, XmRepositoryConfig, } from '@xm-ngx/components/entity-collection';
import { firstValueFrom } from 'rxjs';
import { XmFilterQueryParams, IXmTableCollectionController, } from './i-xm-table-collection-controller';

import { cloneDeep } from 'lodash';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableRepositoryResolver, } from '@xm-ngx/components/table/repositories/xm-table-repository-resolver.service';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import {
    XmTableWidgetConfig,
} from '../../table-widget/xm-table-widget.config';
import * as _ from 'lodash';
import { PageableAndSortable, PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmTableFilterController } from '../filters/xm-table-filter-controller.service';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { XmDynamicWithSelector } from '@xm-ngx/dynamic/src/interfaces';
import { XmFormatJsTemplateRecursive } from '@xm-ngx/shared/operators';

export interface IXmTableRepositoryCollectionControllerConfig {
    filtersToRequest?: XmFormatJsTemplateRecursive,
    repository: XmTableRepositoryCollectionConfig;
}

export interface XmTableRepositoryCollectionControllerConfig extends IXmTableRepositoryCollectionControllerConfig {
    type: 'repository',
}

export interface XmTableRepositoryCollectionConfig extends XmDynamicService<XmRepositoryConfig>, XmDynamicWithSelector {
}

@Injectable()
export class XmTableRepositoryCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public config: XmTableWidgetConfig;

    constructor(
        private configController: XmTableConfigController<XmTableWidgetConfig>,
        private tableFilterController: XmTableFilterController,
        protected repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        if (_.isEmpty(request.pageableAndSortable)) {
            request.pageableAndSortable = PAGEABLE_AND_SORTABLE_DEFAULT;
        }
        this.config = await firstValueFrom(this.configController.config$());

        this.repository = await this.repositoryResolver.get();

        this.changePartial({loading: true, pageableAndSortable: request.pageableAndSortable});

        this.repository
            .query(request)
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
                (_) => this.tableFilterController.refresh(),
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
}
