import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import {
    ColumnsSettingStorageItem,
    IXmTableCollectionController,
    IXmTableCollectionState,
    XM_TABLE_CONTROLLERS,
    XmTableCollectionControllerResolver,
    XmTableColumnsSettingStorageService,
    XmTableConfigController
} from '../controllers';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { PageableAndSortable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { XmTableQueryParamsStoreService } from '../controllers/filters/xm-table-query-params-store.service';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from './xm-table.model';
import { map } from 'rxjs/operators';

function getConfig(value: Partial<XmTableConfig>): XmTableConfig {
    const config = defaultsDeep({}, value, XM_TABLE_CONFIG_DEFAULT) as XmTableConfig;
    config.columns.forEach(c => c.name = c.name || c.field);
    config.pageableAndSortable.sortBy = config.pageableAndSortable.sortBy || config.columns[0].name;
    return config;
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

export interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] };
}

@Directive({
    selector: '[xmTableDirective]',
    exportAs: 'xmTableDirective',
    providers: [
        ...XM_TABLE_CONTROLLERS,
        XmTableFilterController,
    ],
    standalone: true,
})
export class XmTableDirective implements OnInit {
    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$: ReplaySubject<PageableAndSortable> = new ReplaySubject<PageableAndSortable>(1);

    @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) public sort: MatSort;
    private controller: IXmTableCollectionController<unknown>;

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private configController: XmTableConfigController,
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private queryParamsStoreService: XmTableQueryParamsStoreService,
    ) {
    }

    private _config: XmTableConfig;

    public get config(): XmTableConfig {
        return this._config;
    }

    @Input('xmTableDirectiveConfig')
    public set config(value: XmTableConfig) {
        this._config = getConfig(value);

        this.configController.change(this._config);
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

    public async ngOnInit(): Promise<void> {
        this.controller = await this.collectionControllerResolver.get();

        this.context$ = combineLatest([
            this.controller.state$(),
            this.columnsSettingStorageService.getStore()]).pipe(
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
            .subscribe(([filterParams, pageableAndSortable]) => {
                const queryParams = _.merge({}, { pageableAndSortable }, { filterParams });
                const removeFieldsFromUrl = Object.keys(this.config.queryParamsToFillter ?? {})
                    .reduce((acc, key) => ({ ...acc, [key]: null }), {});

                this.queryParamsStoreService.set(queryParams, removeFieldsFromUrl);

                this.controller.load(queryParams);
            });

        this.initQueryParams();
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
        const queryParams = this.queryParamsStoreService.get(this.config.queryParamsToFillter);

        this.tableFilterController.set(queryParams.filterParams);
        const { pageIndex, pageSize, sortBy, sortOrder } = this.config.pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        };
        this.pageableAndSortable$.next(_.merge({}, pageParams, queryParams.pageableAndSortable));
    }
}
