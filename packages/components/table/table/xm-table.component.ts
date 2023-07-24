import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from '@xm-ngx/components/table/interfaces/xm-table.model';
import { MatCardModule } from '@angular/material/card';
import { XmTranslationModule } from '@xm-ngx/translation';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { XmTableFilterButtonComponent } from '@xm-ngx/components/table/components/xm-table-filter-button.component';
import { XmTableFilterInlineComponent } from '@xm-ngx/components/table/components/xm-table-filter-inline.component';
import { XmTableActionsButtonsComponent } from '@xm-ngx/components/table/components/xm-table-actions-buttons.component';
import {
    IXmTableCollectionController,
    IXmTableCollectionState,
    XM_TABLE_CONTROLLERS,
    XmTableCollectionControllerResolver,
    XmTableConfigController,
} from '../controllers';
import { XmTableSelectionService } from '@xm-ngx/components/table/controllers/selections/xm-table-selection.service';
import {
    XmTableFilterController
} from '@xm-ngx/components/table/controllers/filters/xm-table-filter-controller.service';
import {
    XmTableSelectionHeaderComponent
} from '@xm-ngx/components/table/components/selection-header/xm-table-selection-header.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { XmTableEmptyComponent } from '@xm-ngx/components/table/components/xm-table-empty.component';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { XmTableDynamicColumnComponent } from '../columns/xm-table-dynamic-column.component';
import { XmTableColumn, XmTableColumnDynamicCellComponent } from '../columns/xm-table-column-dynamic-cell.component';
import { map } from 'rxjs/operators';
import {
    SelectTableColumn,
    XM_TABLE_SELECTION_COLUMN_DEFAULT,
    XmTableSelectionColumnComponent,
} from '@xm-ngx/components/table/components/xm-table-selection-column.component';
import * as _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { XmTableLoadingColumnComponent } from '@xm-ngx/components/table/components/xm-table-loading-column.component';
import {
    ColumnsSettingStorageItem,
    XmTableColumnsSettingStorageService,
} from '@xm-ngx/components/table/controllers/config/xm-table-columns-setting-storage.service';
import { XmTableHeaderComponent } from '@xm-ngx/components/table/components/xm-table-header.component';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import {
    XmTableQueryParamsStoreService
} from '@xm-ngx/components/table/controllers/filters/xm-table-query-params-store.service';

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

interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] }
}

@Component({
    selector: 'xm-table',
    templateUrl: './xm-table.component.html',
    styleUrls: ['./xm-table.component.scss'],
    standalone: true,
    host: { class: 'xm-table' },
    imports: [
        MatCardModule,
        XmTranslationModule,
        NgIf,
        JsonPipe,
        XmTableFilterButtonComponent,
        XmTableFilterInlineComponent,
        XmTableActionsButtonsComponent,
        XmTableSelectionHeaderComponent,
        MatPaginatorModule,
        XmTableEmptyComponent,
        MatTableModule,
        MatSortModule,
        AsyncPipe,
        XmTableDynamicColumnComponent,
        XmTableColumnDynamicCellComponent,
        NgForOf,
        XmTableSelectionColumnComponent,
        XmTableLoadingColumnComponent,
        NgClass,
        XmTableHeaderComponent,
    ],
    providers: [
        ...XM_TABLE_CONTROLLERS,
        XmTableSelectionService,
        XmTableFilterController,
    ],
})
export class XmTableComponent implements OnInit {
    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$: ReplaySubject<PageableAndSortable> = new ReplaySubject<PageableAndSortable>(1);
    public selectColumn: SelectTableColumn = _.cloneDeep(XM_TABLE_SELECTION_COLUMN_DEFAULT);
    public dynamicColumns: XmTableColumn[] = [];

    @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) public sort: MatSort;
    private controller: IXmTableCollectionController<unknown>;

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private configController: XmTableConfigController,
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        public queryParamsStoreService: XmTableQueryParamsStoreService,
    ) {
    }

    private _config: XmTableConfig;

    public get config(): XmTableConfig {
        return this._config;
    }

    @Input()
    public set config(value: XmTableConfig) {
        this._config = getConfig(value);

        this.dynamicColumns = this._config.columns.filter(c => c.name != '_selectColumn');
        this.selectColumn = (this._config.columns?.find(c => c.name == '_selectColumn') as SelectTableColumn) ?? this.selectColumn;

        this.configController.change(this._config);
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

    public async ngOnInit(): Promise<void> {
        this.controller = await this.collectionControllerResolver.get();

        this.context$ = combineLatest([
            this.controller.state$(),
            this.columnsSettingStorageService.getStore()]).pipe(
            map(([state, a]) => {
                return ({
                    collection: state,
                    settings: { displayedColumns: _.map(_.filter(a, i => !i.hidden), i => i.name) },
                } as IXmTableContext);
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
