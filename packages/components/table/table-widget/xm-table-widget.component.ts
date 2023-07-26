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
import {
    XmTableSelectionColumnComponent,
} from '../components/xm-table-selection-column.component';
import { XmTableLoadingColumnComponent } from '../components/xm-table-loading-column.component';
import { XmTableHeaderComponent } from '../components/xm-table-header.component';
import { XM_TABLE_WIDGET_CONFIG_DEFAULT, XmTableWidgetConfig } from './xm-table-widget.config';
import { XmTableDirective } from '../directives/xm-table.directive';
import { Defaults } from '@xm-ngx/operators';
import { XmTableSelectionDirective } from '../directives/xm-table-selection.directive';

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
    providers: [],
})
export class XmTableWidget {
    @Input() @Defaults(XM_TABLE_WIDGET_CONFIG_DEFAULT)
    public config: XmTableWidgetConfig;
}
