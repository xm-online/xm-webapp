import { Injectable } from '@angular/core';
import { IEntityCollectionPageable, PAGEABLE_AND_SORTABLE_DEFAULT, PageableAndSortable } from '@xm-ngx/repositories';
import { IXmTableCollectionController, XmFilterQueryParams, } from '../collections/i-xm-table-collection-controller';

import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { XmTableRepositoryResolver } from '../../repositories/xm-table-repository-resolver.service';
import { NotSupportedException } from '@xm-ngx/exceptions';
import { AXmTableStateCollectionController } from '../collections/a-xm-table-state-collection-controller.service';
import { take } from 'rxjs/operators';
import { XmConfig } from '@xm-ngx/interfaces';
import {
    XmTableReadOnlyRepositoryCollectionControllerConfig
} from '@xm-ngx/components/table/controllers/collections/xm-table-read-only-repository-collection-controller';

export interface XmTableElasticSearchCollectionControllerConfig extends XmConfig {
    type: 'elasticSearch'
}

@Injectable()
export class XmTableElasticSearchCollectionController<T = unknown>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {
    public repository: IEntityCollectionPageable<T, PageableAndSortable>;
    public entity: object;
    public config: XmTableReadOnlyRepositoryCollectionControllerConfig;

    constructor(
        protected repositoryResolver: XmTableRepositoryResolver<T>
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        if (_.isEmpty(request.pageableAndSortable)) {
            request.pageableAndSortable = PAGEABLE_AND_SORTABLE_DEFAULT;
        }
        this.repository = await this.repositoryResolver.get(this.config.repository);

        this.changePartial({ loading: true, pageableAndSortable: request.pageableAndSortable });

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
