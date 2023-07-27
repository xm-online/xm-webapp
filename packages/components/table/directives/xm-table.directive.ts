import { ContentChild, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import {
    ColumnsSettingStorageItem,
    IXmTableCollectionController,
    IXmTableCollectionState,
    XmTableColumnsSettingStorageService,
} from '../controllers';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { PageableAndSortable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { XmTableQueryParamsStoreService } from '../controllers/filters/xm-table-query-params-store.service';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from './xm-table.model';
import { map } from 'rxjs/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { cloneDeep } from 'lodash';

export interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] };
}

function getDisplayedColumns(config: XmTableConfig): ColumnsSettingStorageItem[] {
    const displayedColumns = config.columns;
    return displayedColumns.map(i => ({
        name: i.name || i.field,
        hidden: i['hidden'] || false,
        title: i.title,
        isHideLock: i['isHideLock'] || false,
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
    @Input('xmTableController')
    public controller: IXmTableCollectionController<unknown>;

    constructor(
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private queryParamsStoreService: XmTableQueryParamsStoreService,
    ) {
    }

    private _config: XmTableConfig;

    public get config(): XmTableConfig {
        return this._config;
    }

    @Input('xmTableConfig')
    public set config(value: XmTableConfig) {
        this._config = _.defaultsDeep({}, value, cloneDeep(XM_TABLE_CONFIG_DEFAULT));
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

    public ngOnInit(): void {
        this.context$ = combineLatest([
            this.controller.state$(),
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

        combineLatest([
            this.tableFilterController.change$(),
            this.pageableAndSortable$,
        ])
            .pipe(takeUntilOnDestroy(this))
            .subscribe(([filterParams, pageableAndSortable]) => {
                const queryParams = _.merge({}, { pageableAndSortable }, { filterParams });
                const removeFieldsFromUrl = Object.keys(this._config.queryParamsToFillter ?? {})
                    .reduce((acc, key) => ({ ...acc, [key]: null }), {});

                this.queryParamsStoreService.set(queryParams, removeFieldsFromUrl);

                this.controller.load(queryParams);
            });

        this.initQueryParams();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public updatePagination(): void {
        const sortBy = this._config.columns.find((i) => i.name === this.sort.active)?.name;
        const sortOrder = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: PageableAndSortable = { pageIndex, pageSize, sortOrder, sortBy, total };
        this.pageableAndSortable$.next(pageAndSort);
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
