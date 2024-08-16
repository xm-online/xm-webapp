import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { injectByKey } from '@xm-ngx/dynamic';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { defaultsDeep } from 'lodash';
import { XmTableColumnDynamicCellComponent } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableDynamicColumnComponent } from '../columns/xm-table-dynamic-column.component';
import { XmTableSelectionHeaderComponent } from '../components/selection-header/xm-table-selection-header.component';
import { XmTableActionsButtonsComponent } from '../components/xm-table-actions-buttons.component';
import { XmTableEmptyComponent } from '../components/xm-table-empty.component';
import { XmTableFilterButtonComponent } from '../components/xm-table-filter-button.component';
import { XmTableFilterChipsComponent } from '../components/xm-table-filter-chips.component';
import { XmTableHeaderComponent } from '../components/xm-table-header.component';
import { XmTableLoadingColumnComponent } from '../components/xm-table-loading-column.component';
import { XmTableLoadingComponent } from '../components/xm-table-loading.component';
import { XmTableSelectionColumnComponent } from '../components/xm-table-selection-column.component';
import { IXmTableCollectionController, XM_TABLE_CONTROLLERS, XmTableCollectionControllerResolver } from '../collections';
import { XmTableMatPaginatorAdapterDirective } from '../directives/xm-table-mat-paginator-adapter.directive';
import { XmTableMatSortAdapterDirective } from '../directives/xm-table-mat-sort-adapter.directive';
import { XmTableSelectionDirective } from '../directives/xm-table-selection.directive';
import { XmTableDirective } from '../directives/xm-table.directive';
import { XM_TABLE_CONFIG_DEFAULT } from '../directives/xm-table.model';
import { XM_TABLE_WIDGET_CONFIG_DEFAULT, XmTableWidgetConfig } from './xm-table-widget.config';
import { XmTableExpandPanelButtonComponent } from '../components/xm-table-expand-panel-button.component';
import { TableExpand } from '../animations/xm-table-widget.animation';
import { XmTableFilterInlineComponent } from '../components/xm-table-filter-inline.component';
import { XmTableMatPaginatorInt } from './table.mat-paginator-int';

function getConfig(value: Partial<XmTableWidgetConfig>): XmTableWidgetConfig {
    const config = defaultsDeep({}, value, XM_TABLE_WIDGET_CONFIG_DEFAULT, XM_TABLE_CONFIG_DEFAULT) as XmTableWidgetConfig;
    config.columns.forEach(c => (c.name = c.name || c.field));
    config.pageableAndSortable.sortBy = config.pageableAndSortable.sortBy || config.columns[0].name;
    config.storageKey = config.storageKey || `${location.pathname}.xm-table-widget`;
    return config;
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
        XmTableMatPaginatorAdapterDirective,
        XmTableMatSortAdapterDirective,
        XmTableLoadingColumnComponent,
        XmTableLoadingComponent,
        XmTableExpandPanelButtonComponent,
        XmTableFilterInlineComponent
    ],
    providers: [
        ...XM_TABLE_CONTROLLERS,
        {
            provide: MatPaginatorIntl,
            useClass: XmTableMatPaginatorInt
        },
    ],
    animations: [
        TableExpand
    ],
})
export class XmTableWidget {

    private collectionController: IXmTableCollectionController<unknown> = injectByKey<IXmTableCollectionController<unknown>>('collection', {optional: true});

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver) {
    }

    private _config: XmTableWidgetConfig;

    public get config(): XmTableWidgetConfig {
        return this._config;
    }

    @Input()
    public set config(value: XmTableWidgetConfig) {
        this._config = getConfig(value);
    }

    @Output() public rowClicked = new EventEmitter<unknown>();

    public getCollectionController(): IXmTableCollectionController<unknown> {
        return this.collectionController || this.collectionControllerResolver.factory(this.config.collection);
    }
}
