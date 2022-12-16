import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { LoadingBarModule } from '@xm-ngx/components/loading-bar';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmMatTableColumnDynamicCellModule } from '@xm-ngx/components/table';
import { XmDynamicTableComponent } from '@xm-ngx/components/table/xm-table/xm-dynamic-table/xm-dynamic-table.component';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { MatModule } from '../../../../src/app/mat.module';
import { NoRowsComponent } from './components/no-rows/no-rows.component';
import { SelectionColumnComponent } from './components/selection-column/selection-column.component';
import { SelectionHeaderComponent } from './components/selection-header/selection-header.component';
import { DataService } from './service/data-service/data.service';
import { ApiDataSource } from './service/data-sources/api-data-source';
import { EntityDataSource } from './service/data-sources/entity-data-source';
import { ObjectDataSource } from './service/data-sources/object-data-source';
import { StaticDataSource } from './service/data-sources/static-data-source';
import { TmfApiDataSource } from './service/data-sources/tm-api-data-source';
import { RequestBuilderService } from './service/request-builder-service/request-builder.service';
import { TableSelectionService } from './service/xm-table-selection-service/table-selection.service';
import { TableHeaderModule } from './components/table-header/table-header.module';
import { XmTableComponent } from './xm-table.component';


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
        { provide: 'STATIC', useClass: StaticDataSource },
        { provide: 'ENTITY', useClass: EntityDataSource },
        { provide: 'OBJECT', useClass: ObjectDataSource },
        { provide: 'TMF-API', useClass: TmfApiDataSource },
        { provide: 'API', useClass: ApiDataSource },
    ],
})
export class XmTableModule<T> {
    public entry: Type<XmTableComponent<T>> = XmTableComponent;
}
