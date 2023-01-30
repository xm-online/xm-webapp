import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    XM_TABLE_CONFIG_DEFAULT,
    XmTableConfig,
} from './interfaces/xm-table.model';
import { MatCardModule } from '@angular/material/card';
import { XmTranslationModule } from '@xm-ngx/translation';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
    XmTableFilterComponent,
} from './components/table-filter/xm-table-filter.component';
import {
    TableFilterChipsComponent,
} from './components/table-filter-chips/table-filter-chips.component';
import {
    TableActionsButtonsComponent,
} from './components/table-actions-buttons/table-actions-buttons.component';
import {
    XmTableCollectionControllerResolver,
    XM_TABLE_CONTROLLERS,
    XmTableConfigController,
    IXmTableCollectionState,
    IXmTableCollectionController,
} from './controllers';
import {
    XmTableSelectionService,
} from './controllers/selections/xm-table-selection.service';
import {
    XmTableFilterController,
} from './controllers/filters/xm-table-filter-controller.service';
import { XmTableDataLoaderService } from './data/xm-table-data-loader.service';
import {
    XmTableSelectionHeaderComponent,
} from './components/selection-header/xm-table-selection-header.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { XmTableEmptyComponent } from './components/table-empty/xm-table-empty.component';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { XmTableDynamicColumnModule } from '../column/xm-table-dynamic-column';
import { TableColumnDynamicCellModule } from '../column/table-column-dynamic-cell';
import { map, tap } from 'rxjs/operators';
import { Pageable, Sortable } from '@xm-ngx/components/entity-collection';
import {
    SelectTableColumn,
    XM_TABLE_SELECTION_COLUMN_DEFAULT,
    XmTableSelectionColumnComponent,
} from './components/selection-column/selection-column.component';
import * as _ from 'lodash';
import { defaultsDeep } from 'lodash';
import {
    XmTableLoadingColumnComponent
} from './components/xm-table-loading-column.component';

function getConfig(value: Partial<XmTableConfig>): XmTableConfig {
    const config = defaultsDeep({}, value, XM_TABLE_CONFIG_DEFAULT) as XmTableConfig;
    config.columns.forEach(c => c.name = c.name || c.field);
    config.pageableAndSortable.sortBy = config.pageableAndSortable.sortBy || config.columns[0].name;
    return config;
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
        XmTableFilterComponent,
        TableFilterChipsComponent,
        TableActionsButtonsComponent,
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
    ],
    providers: [
        ...XM_TABLE_CONTROLLERS,
        XmTableSelectionService,
        XmTableFilterController,
        XmTableDataLoaderService,
    ],
})
export class XmTableComponent implements OnInit {
    public get config(): XmTableConfig | Partial<XmTableConfig> {
        return this._config;
    }

    @Input()
    public set config(value: XmTableConfig | Partial<XmTableConfig>) {
        this._config = getConfig(value);
    }

    private _config: XmTableConfig;

    public context$: Observable<IXmTableContext>;
    private context: IXmTableContext;

    // public dataSource$: Observable<DataSource<unknown>>;
    // public loading$: Observable<boolean> = of(false);
    private controller: IXmTableCollectionController<unknown>;

    public selectColumn: SelectTableColumn = _.cloneDeep(XM_TABLE_SELECTION_COLUMN_DEFAULT);

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private configController: XmTableConfigController,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        this.configController.change(this.config);
        this.controller = await this.collectionControllerResolver.get();
        this.context$ = this.controller.state$()
            .pipe(
                map(state => {
                    return ({
                        collection: state,
                        settings: { displayedColumns: this.GetDisplayedColumns() },
                    });
                }),
                tap((ctx) => {
                    this.context = ctx;
                }),
            );
        this.controller.load(this._config.pageableAndSortable);
    }

    public GetDisplayedColumns(): string[] {
        const displayedColumns = this._config.columns.map(i => i.name);
        if (this._config.options.isRowSelectable) {
            displayedColumns.unshift(this.selectColumn.name);
        }
        return displayedColumns;
    }


    @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) public sort: MatSort;

    public updatePagination(): void {
        const sortBy = this.context.settings.displayedColumns.find((i) => i === this.sort.active);
        const sortOrder = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: Pageable & Sortable = { pageIndex, pageSize, sortOrder, sortBy, total };
        this.controller.load(pageAndSort);
    }
}
