import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from './interfaces/xm-table.model';
import { MatCardModule } from '@angular/material/card';
import { XmTranslationModule } from '@xm-ngx/translation';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { XmTableFilterButtonComponent } from './components/xm-table-filter-button.component';
import { XmTableFilterInlineComponent } from './components/xm-table-filter-inline.component';
import { XmTableActionsButtonsComponent } from './components/xm-table-actions-buttons.component';
import {
    IXmTableCollectionController,
    IXmTableCollectionState,
    XM_TABLE_CONTROLLERS,
    XmTableCollectionControllerResolver,
    XmTableConfigController,
} from './controllers';
import { XmTableSelectionService } from './controllers/selections/xm-table-selection.service';
import { XmTableFilterController } from './controllers/filters/xm-table-filter-controller.service';
import { XmTableSelectionHeaderComponent } from './components/selection-header/xm-table-selection-header.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { XmTableEmptyComponent } from './components/xm-table-empty.component';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { XmTableDynamicColumnModule } from '../column/xm-table-dynamic-column';
import { TableColumnDynamicCellModule } from '../column/table-column-dynamic-cell';
import { map } from 'rxjs/operators';
import {
    SelectTableColumn,
    XM_TABLE_SELECTION_COLUMN_DEFAULT,
    XmTableSelectionColumnComponent,
} from './components/xm-table-selection-column.component';
import * as _ from 'lodash';
import {
    defaultsDeep,
} from 'lodash';
import { XmTableLoadingColumnComponent } from './components/xm-table-loading-column.component';
import {
    ColumnsSettingStorageItem,
    ColumnsSettingStorageService,
} from '@xm-ngx/components/table/service/columns-settings-storage.service';
import { XmTableHeaderComponent } from '@xm-ngx/components/table/table/components/xm-table-header.component';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { ActivatedRoute, Router } from '@angular/router';

function getConfig(value: Partial<XmTableConfig>): XmTableConfig {
    const config = defaultsDeep({}, value, XM_TABLE_CONFIG_DEFAULT) as XmTableConfig;
    config.columns.forEach(c => c.name = c.name || c.field);
    config.pageableAndSortable.sortBy = config.pageableAndSortable.sortBy || config.columns[0].name;
    return config;
}

function GetDisplayedColumns(config: XmTableConfig): ColumnsSettingStorageItem[] {
    const displayedColumns = config.columns;
    return displayedColumns.map(i => ({
        name: i.name || i.field,
        hidden: false,
        title: i.title,
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
    host: {class: 'xm-table'},
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
        XmTableDynamicColumnModule,
        TableColumnDynamicCellModule,
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
        ColumnsSettingStorageService,
    ],
})
export class XmTableComponent implements OnInit {
    private _config: XmTableConfig;

    public get config(): XmTableConfig | Partial<XmTableConfig> {
        return this._config;
    }

    @Input()
    public set config(value: XmTableConfig | Partial<XmTableConfig>) {
        this._config = getConfig(value);
        this.configController.change(this.config);
        this.columnsSettingStorageService.updateStore(GetDisplayedColumns(this._config));
        this.pageableAndSortable$.next(this._config.pageableAndSortable);
    }

    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$: ReplaySubject<PageableAndSortable> = new ReplaySubject<PageableAndSortable>(1);
    public selectColumn: SelectTableColumn = _.cloneDeep(XM_TABLE_SELECTION_COLUMN_DEFAULT);
    @ViewChild(MatPaginator, {static: false}) public paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) public sort: MatSort;

    private controller: IXmTableCollectionController<unknown>;

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private configController: XmTableConfigController,
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: ColumnsSettingStorageService,
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    public async ngOnInit(): Promise<void> {
        this.controller = await this.collectionControllerResolver.get();

        this.context$ = combineLatest([
            this.controller.state$(),
            this.columnsSettingStorageService.getStore()]).pipe(
            map(([state, a]) => {
                return ({
                    collection: state,
                    settings: {displayedColumns: _.map(_.filter(a, i => !i.hidden), i => i.name)},
                } as IXmTableContext);
            }),
        );

        this.initFilterParams();

        combineLatest([
            this.tableFilterController.change$(),
            this.pageableAndSortable$,
        ])
            .subscribe(([filterParams, pageableAndSortable]) => {
                const queryParams = _.merge({}, {pageableAndSortable}, {filterParams});
                this.controller.load(queryParams);
            });
    }

    public updatePagination(): void {
        const sortBy = this._config.columns.find((i) => i.name === this.sort.active).name;
        const sortOrder = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: PageableAndSortable = {pageIndex, pageSize, sortOrder, sortBy, total};
        this.pageableAndSortable$.next(pageAndSort);
    }

    private initFilterParams(): void {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.tableFilterController.update(queryParams);
    }
}
