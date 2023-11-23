import { ContentChild, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import {
    IXmTableCollectionController,
    IXmTableCollectionState,
} from '../collections';
import {
    ColumnsSettingStorageItem,
    XmTableColumnsSettingStorageService,
    XmTableFilterController,
    XmTableQueryParamsStoreService,
} from '../controllers';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { PageableAndSortable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig, XmTableEventType } from './xm-table.model';
import { map, startWith } from 'rxjs/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmEventManagerService } from '@xm-ngx/core';

export interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] };
}

function getDisplayedColumns(config: XmTableConfig): ColumnsSettingStorageItem[] {
    const displayedColumns = config.columns;
    return displayedColumns.map(column => ({
        name: column.name || column.field,
        hidden: column['hidden'] || false,
        title: column.title,
        isHideLock: column['isHideLock'] || false,
    }));
}

@Directive({
    selector: '[xmTable]',
    exportAs: 'xmTable',
    host: { class: 'xm-table' },
    providers: [
        XmTableFilterController,
        XmTableColumnsSettingStorageService,
        XmTableQueryParamsStoreService,
    ],
    standalone: true,
})
export class XmTableDirective implements OnInit, OnDestroy {
    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$: ReplaySubject<PageableAndSortable> = new ReplaySubject<PageableAndSortable>(1);
    @ContentChild(MatPaginator, { static: false }) public paginator: MatPaginator | null;
    @ContentChild(MatSort, { static: false }) public sort: MatSort | null;
    @Input()
    public xmTableController: IXmTableCollectionController<unknown>;

    constructor(
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private queryParamsStoreService: XmTableQueryParamsStoreService,
        private eventManagerService: XmEventManagerService,
    ) {
    }

    private _config: XmTableConfig;

    public get config(): XmTableConfig {
        return this._config;
    }

    @Input('xmTableConfig')
    public set config(value: XmTableConfig) {
        this._config = _.defaultsDeep({}, value, cloneDeep(XM_TABLE_CONFIG_DEFAULT));
        this.setStorageKeys();
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

    public ngOnInit(): void {
        this.onControllerStateChangeUpdateContext();
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
                    settings: { displayedColumns },
                });
            }),
        );

        combineLatest(
            {
                tableFilter: this.tableFilterController.change$(),
                pageableAndSortable: this.pageableAndSortable$,
                updateEvent: this.eventManagerService.listenTo(
                    this.config.triggerTableKey + XmTableEventType.XM_TABLE_UPDATE,
                ).pipe(startWith(null)),
            }
        )
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe((obsObj) => {
                const filterParams = obsObj.tableFilter;
                const pageableAndSortable = obsObj.pageableAndSortable;
                const queryParams = _.merge({}, { pageableAndSortable }, { filterParams });
                const removeFieldsFromUrl = Object.keys(this._config.queryParamsToFillter ?? {})
                    .reduce((acc, key) => ({ ...acc, [key]: null }), {});

                this.queryParamsStoreService.set(queryParams, removeFieldsFromUrl);

                this.xmTableController.load(queryParams);
            });

        this.initQueryParams();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public updatePagination(): void {
        const { sortBy: defaultSortBy, sortOrder: defaultSortOrder } = this._config.pageableAndSortable;

        const sortBy = this._config.columns.find((i) => i.name === this.sort.active)?.name ?? defaultSortBy;
        const sortOrder = this.sort.direction ?? defaultSortOrder;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: PageableAndSortable = { pageIndex, pageSize, sortOrder, sortBy, total };
        this.pageableAndSortable$.next(pageAndSort);
    }

    private setStorageKeys(): void {
        const storageKey: string = this.config.storageKey || location.pathname;
        this.columnsSettingStorageService.key = this.queryParamsStoreService.key = storageKey;
    }

    private initQueryParams(): void {
        const queryParams = this.queryParamsStoreService.get(this._config.queryParamsToFillter);

        this.tableFilterController.set(queryParams.filterParams);
        const { pageIndex, pageSize, sortBy, sortOrder } = this._config.pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        };
        this.pageableAndSortable$.next(_.merge({}, pageParams, queryParams.pageableAndSortable));
    }
}
