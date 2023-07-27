import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { XmTableFilterButtonComponent } from '../components/xm-table-filter-button.component';
import { XmTableFilterChipsComponent } from '../components/xm-table-filter-chips.component';
import { XmTableActionsButtonsComponent } from '../components/xm-table-actions-buttons.component';
import { XmTableSelectionHeaderComponent } from '../components/selection-header/xm-table-selection-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { XmTableEmptyComponent } from '../components/xm-table-empty.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { XmTableDynamicColumnComponent } from '../columns/xm-table-dynamic-column.component';
import { XmTableColumnDynamicCellComponent } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableSelectionColumnComponent, } from '../components/xm-table-selection-column.component';
import { XmTableLoadingColumnComponent } from '../components/xm-table-loading-column.component';
import { XmTableHeaderComponent } from '../components/xm-table-header.component';
import { XM_TABLE_WIDGET_CONFIG_DEFAULT, XmTableWidgetConfig } from './xm-table-widget.config';
import { XmTableDirective } from '../directives/xm-table.directive';
import { XmTableSelectionDirective } from '../directives/xm-table-selection.directive';
import {
    ColumnsSettingStorageItem,
    XM_TABLE_CONTROLLERS,
    XmTableCollectionControllerResolver,
    XmTableColumnsSettingStorageService,
    XmTableConfigController
} from '../controllers';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from '../directives/xm-table.model';
import { defaultsDeep } from 'lodash';

function getConfig(value: Partial<XmTableWidgetConfig>): XmTableWidgetConfig {
    const config = defaultsDeep({}, value, XM_TABLE_WIDGET_CONFIG_DEFAULT, XM_TABLE_CONFIG_DEFAULT) as XmTableWidgetConfig;
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

@Component({
    selector: 'xm-table-widget',
    templateUrl: './xm-table-widget.component.html',
    styleUrls: ['./xm-table-widget.component.scss'],
    standalone: true,
    host: { class: 'xm-table-widget' },
    imports: [
        MatCardModule,
        XmTranslatePipe,
        NgIf,
        XmTableDirective,
        JsonPipe,
        XmTableFilterButtonComponent,
        XmTableFilterChipsComponent,
        XmTableActionsButtonsComponent,
        XmTableSelectionHeaderComponent,
        XmTableSelectionDirective,
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
        XmTableFilterController,
    ],
})
export class XmTableWidget {
    constructor(
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private configController: XmTableConfigController,
        public collectionControllerResolver: XmTableCollectionControllerResolver) {
    }

    private _config: XmTableWidgetConfig;

    public get config(): XmTableWidgetConfig {
        return this._config;
    }

    @Input()
    public set config(value: XmTableWidgetConfig) {
        this._config = getConfig(value);

        this.configController.change(this._config);
        this.columnsSettingStorageService.defaultStore(getDisplayedColumns(this._config));
    }

}
