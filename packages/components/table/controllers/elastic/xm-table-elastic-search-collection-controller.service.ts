import { Injectable } from '@angular/core';
import { IEntityCollectionPageable } from '@xm-ngx/repositories';
import { firstValueFrom } from 'rxjs';
import { XmFilterQueryParams, IXmTableCollectionController, } from '../collections/i-xm-table-collection-controller';

import { cloneDeep } from 'lodash';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableRepositoryResolver, } from '../../repositories/xm-table-repository-resolver.service';
import { NotSupportedException } from '@xm-ngx/exceptions';
import { AXmTableStateCollectionController } from '../collections/a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import {
    XmTableWidgetConfig,
} from '../../table-widget/xm-table-widget.config';
import * as _ from 'lodash';
import { PageableAndSortable, PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/repositories';

export interface XmTableElasticSearchCollectionControllerConfig{
    type: 'elasticSearch'
}

@Injectable()
export class XmTableElasticSearchCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public config: XmTableWidgetConfig;
    public entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableWidgetConfig>,
        protected repositoryResolver: XmTableRepositoryResolver<T>
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

}
