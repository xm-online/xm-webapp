import { ContentChild, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Params } from '@angular/router';
import { XmEventManagerService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { PageableAndSortable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { cloneDeep, isEqual, set } from 'lodash';
import { combineLatest, Observable, Subject, startWith, tap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IXmTableCollectionController, IXmTableCollectionState } from '../collections';
import { FiltersControlValue } from '../components/xm-table-filter-button-dialog-control.component';
import {
    ColumnsSettingStorageItem,
    XmTableColumnsSettingStorageService,
    XmTableFilterController,
    XmTableQueryParamsStoreService,
} from '../controllers';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig, XmTableEventType } from './xm-table.model';

export interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] };
}

export interface StaticQueryParams {
    pageableAndSortable: PageableAndSortable;
    filterParams: Record<string, any>;
}

function getDisplayedColumns(config: XmTableConfig): ColumnsSettingStorageItem[] {
    const displayedColumns = config.columns;
    return displayedColumns.map(column => ({
        name: column.name || column.field,
        hidden: column['hidden'] || false,
        title: column.title,
        isHideLock: column['isHideLock'] || false,
        permission: column.permission,
        permissionStrategy: column.permissionStrategy,
        storageColumn: column.storageColumn,
    }));
}

@Directive({
    selector: '[xmTable]',
    exportAs: 'xmTable',
    host: {class: 'xm-table'},
    providers: [
        XmTableFilterController,
        XmTableColumnsSettingStorageService,
        XmTableQueryParamsStoreService,
    ],
    standalone: true,
})
export class XmTableDirective implements OnInit, OnDestroy {
    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$ = new Subject<PageableAndSortable>();
    @ContentChild(MatPaginator, {static: false}) public paginator: MatPaginator | null;
    @ContentChild(MatSort, {static: false}) public sort: MatSort | null;
    @Input()
    public xmTableController: IXmTableCollectionController<unknown>;
    private skipLoadOnInit = false;

    constructor(
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private queryParamsStoreService: XmTableQueryParamsStoreService,
        private eventManagerService: XmEventManagerService,
    ) {
    }

    private _config: XmTableConfig;
    public filters: {};

    public get config(): XmTableConfig {
        return this._config;
    }

    @Input('xmTableConfig')
    public set config(value: XmTableConfig) {
        this._config = _.defaultsDeep({}, value, cloneDeep(XM_TABLE_CONFIG_DEFAULT));
        this._config.storageKey = this._config.storageKey || location.pathname;
        this._config.queryPrefixKey = this._config.storageKey;

        this.setStorageKeys();
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

    public ngOnInit(): void {
        this.skipLoadOnInit = this._config.skipLoadOnInit;
        this.onControllerStateChangeUpdateContext();
    }

    public getSortActiveAndDirection(): Observable<Sort> {
        return this.xmTableController.state$().pipe(
            map((state) => {
                return {
                    active: state?.pageableAndSortable?.sortBy as string,
                    direction: state?.pageableAndSortable?.sortOrder,
                };
            }),
            shareReplay(1),
        );
    }

    public onControllerStateChangeUpdateContext(): void {
        this.context$ = combineLatest([
            this.xmTableController.state$(),
            this.columnsSettingStorageService.getStore(),
        ]).pipe(
            map(([state, a]) => {
                const displayedColumns = _.map(_.filter(a, i => !i.hidden), i => i.name);
                return ({
                    collection: state,
                    settings: {displayedColumns},
                });
            }),
            shareReplay(1),
        );

        const queryParams = this.getInitialQueryParams();

        combineLatest([
            this.queryParamsStoreService.listenQueryParamsToFilter(this.config.queryParamsFilter).pipe(
                startWith(queryParams?.filterParams ?? {}),
            ),
            this.eventManagerService.listenTo<{ queryParams: Params }>(`${this.config.triggerTableKey}${XmTableEventType.XM_TABLE_UPDATE}`).pipe(
                map((evt) => {
                    return {
                        eventFilter: evt.payload?.queryParams,
                        triggerEvent: true,
                    }
                }),
                startWith({} as any),
            ),
        ]).pipe(
            tap(([queryFilter, eventManager]) => {
                const mergeFilters = _.merge({}, queryFilter, eventManager.eventFilter);

                if(eventManager.triggerEvent) {
                    this.tableFilterController.update(mergeFilters);
                    return;
                }

                if (_.isEmpty(mergeFilters)) {
                    return;
                }

                this.tableFilterController.update(mergeFilters);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        combineLatest({
            tableFilter: this.tableFilterController.change$(),
            pageableAndSortable: this.pageableAndSortable$.pipe(
                startWith(queryParams.pageableAndSortable ?? {}),
            ),
        }).pipe(
            takeUntilOnDestroy(this),
        ).subscribe((obsObj) => {
            const filterParams = obsObj.tableFilter;
            const pageableAndSortable = this.mapPageableAndSortable(filterParams, obsObj.pageableAndSortable);
            this.filters = cloneDeep(filterParams);
            const queryParams = _.merge({}, {pageableAndSortable}, {filterParams});

            this.queryParamsStoreService.set(queryParams, this.config);

            if (!this.skipLoadOnInit) {
                this.xmTableController.load(queryParams);
            }
            this.skipLoadOnInit = false;
        });
    }

    private mapPageableAndSortable(filterParams: FiltersControlValue, pageableAndSortable: PageableAndSortable): PageableAndSortable {
        if (this.filters && !isEqual(filterParams, this.filters)) {
            set(pageableAndSortable, 'pageIndex', 0);
        }
        return pageableAndSortable;
    }


    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public updatePagination(refreshIndex?: boolean): void {
        const {sortBy: defaultSortBy, sortOrder: defaultSortOrder} = this._config.pageableAndSortable;

        const sortBy = this._config.columns.find((i) => i.name === this.sort.active)?.name ?? defaultSortBy;
        const sortOrder = this.sort.direction ?? defaultSortOrder;
        const pageIndex = refreshIndex ? 0 : this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: PageableAndSortable = {pageIndex, pageSize, sortOrder, sortBy, total};
        this.pageableAndSortable$.next(pageAndSort);
    }


    private setStorageKeys(): void {
        this.columnsSettingStorageService.key = this.config.storageKey;
        this.queryParamsStoreService.key = this.config.queryPrefixKey;
    }

    private getInitialQueryParams(): StaticQueryParams {
        const {filterParams, pageableAndSortable} = (this.queryParamsStoreService.get() ?? {}) as StaticQueryParams;
        const {pageIndex, pageSize, sortBy, sortOrder} = this._config.pageableAndSortable;

        const mergePageAndSort = _.merge({}, {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        }, pageableAndSortable);

        return {
            pageableAndSortable: mergePageAndSort,
            filterParams,
        };
    }
}
