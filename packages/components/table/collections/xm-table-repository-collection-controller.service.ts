import { inject, Injectable, Injector } from '@angular/core';
import { IEntityCollectionPageable, QueryParams, XmRepositoryConfig } from '@xm-ngx/repositories';
import { XmFilterQueryParams, IXmTableCollectionController, } from './i-xm-table-collection-controller';

import { cloneDeep } from 'lodash';
import { XmTableRepositoryResolver, } from '../repositories/xm-table-repository-resolver.service';
import { NotSupportedException } from '@xm-ngx/exceptions';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';
import { map, take, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { PageableAndSortable, PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/repositories';
import { XmDynamicInstanceService, XmDynamicService, XmDynamicWithSelector } from '@xm-ngx/dynamic';
import { Defaults, XmFormatJsTemplateRecursive } from '@xm-ngx/operators';
import { XmConfig } from '@xm-ngx/interfaces';
import {
    XmTableReadOnlyRepositoryCollectionControllerConfig
} from './xm-table-read-only-repository-collection-controller';
import { XmEventManagerService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { XmTableEventType } from '../directives/xm-table.model';

export interface IXmTableRepositoryCollectionControllerConfig extends XmConfig {
    filtersToRequest?: XmFormatJsTemplateRecursive,
    repository: XmTableRepositoryCollectionConfig;
    triggerTableKey?: string;
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
    public repository: IEntityCollectionPageable<T, PageableAndSortable> | any;
    @Defaults({
        triggerTableKey: 'action'
    }) public declare config: XmTableReadOnlyRepositoryCollectionControllerConfig;

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);
    private eventManagerService = inject(XmEventManagerService);

    constructor(
        protected repositoryResolver: XmTableRepositoryResolver<T>,
    ) {
        super();
    }

    private get repositoryController(): IEntityCollectionPageable<T, PageableAndSortable> {
        return this.repository || this.xmDynamicInstanceService.getControllerByKey(
            'repository',
            this.injector
        );
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        if (_.isEmpty(request.pageableAndSortable)) {
            request.pageableAndSortable = PAGEABLE_AND_SORTABLE_DEFAULT;
        }

        this.repository = this.repositoryController || await this.repositoryResolver.get(this.config.repository);

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
                            pageSize: res.body.pageSize || request.pageableAndSortable.pageSize,
                            pageIndex: res.body.pageIndex || request.pageableAndSortable.pageIndex,
                            sortBy: res.body.sortBy || request.pageableAndSortable.sortBy,
                            sortOrder: res.body.sortOrder || request.pageableAndSortable.sortOrder,
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

    public update(
        payload: T,
        params?: QueryParams,
        headers?: HttpHeaders
    ): Observable<T> {
        return this.repositoryController.update(payload, params, headers)
            .pipe(
                tap(() => this.eventManagerService.broadcast({name: this.config.triggerTableKey + XmTableEventType.XM_TABLE_UPDATE})),
                map((res) => res?.body)
            );
    }

    public create(
        payload: T,
        params?: QueryParams,
        headers?: HttpHeaders
    ): Observable<T> {
        return this.repositoryController.create(payload, params, headers)
            .pipe(
                tap(() => this.eventManagerService.broadcast({name: this.config.triggerTableKey + XmTableEventType.XM_TABLE_UPDATE})),
                map((res) => res?.body)
            );
    }

    public delete(
        id: string | number,
        params?: QueryParams,
        headers?: HttpHeaders
    ): Observable<unknown> {
        return this.repositoryController.delete(id, params, headers)
            .pipe(
                tap(() => this.eventManagerService.broadcast({name: this.config.triggerTableKey + XmTableEventType.XM_TABLE_UPDATE})),
                map((res) => res?.body)
            );
    }

    public patch(
        payload: T,
        params?: QueryParams,
        headers?: HttpHeaders
    ): Observable<unknown> {
        return this.repositoryController.patch(payload, params, headers)
            .pipe(
                tap(() => this.eventManagerService.broadcast({name: this.config.triggerTableKey + XmTableEventType.XM_TABLE_UPDATE})),
                map((res) => res?.body)
            );
    }
}
