import {CommonModule} from '@angular/common';
import {NgModule, Type} from '@angular/core';
import {LoadingBarModule} from '@xm-ngx/components/loading-bar';
import {NoDataModule} from '@xm-ngx/components/no-data';
import {XmMatTableColumnDynamicCellModule} from '@xm-ngx/components/table';
import {TableSelectionService} from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/table-selection.service';
import {SelectionHeaderComponent} from '@xm-ngx/components/table/xm-table/selection-header/selection-header.component';
import {TableHeaderModule} from '@xm-ngx/components/table/xm-table/table-header/table-header.module';
import {XmDynamicTableComponent} from '@xm-ngx/components/table/xm-table/xm-dynamic-table/xm-dynamic-table.component';
import {XmDynamicModule} from '@xm-ngx/dynamic';
import {MatModule} from '../../../../src/app/mat.module';
import {NoRowsComponent} from './no-rows/no-rows.component';
import {SelectionColumnComponent} from './selection-column/selection-column.component';
import {XmTableComponent} from './xm-table.component';
import {RequestBuilderService} from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';
import {DataService} from '@xm-ngx/components/table/xm-table/service/data-service/data.service';
import {XmEntityService} from '@xm-ngx/entity';


@NgModule({
    declarations: [
        XmTableComponent,
        XmDynamicTableComponent,
        NoRowsComponent,
        SelectionColumnComponent,
        SelectionHeaderComponent,
    ],
    imports: [
        CommonModule,
        MatModule,
        XmDynamicModule,
        XmMatTableColumnDynamicCellModule,
        LoadingBarModule,
        NoDataModule,
        TableHeaderModule,
    ],
    providers: [
        TableSelectionService,
        RequestBuilderService,
        DataService,
        {provide: 'ENTITY', useClass: XmEntityService},

    ],
})
export class XmTableModule {
    public entry: Type<XmTableComponent> = XmTableComponent;
}
