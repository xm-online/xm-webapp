import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingBarModule } from '@xm-ngx/components/loading-bar';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTableDynamicColumnsCellModule } from '@xm-ngx/components/table';
import { XmDynamicConstructor, XmDynamicEntryModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { MatModule } from '../../../../src/app/mat.module';
import { NoRowsComponent } from './components/no-rows/no-rows.component';
import { SelectionColumnComponent } from './components/selection-column/selection-column.component';
import { SelectionHeaderComponent } from './components/selection-header/selection-header.component';
import { TableHeaderModule } from './components/table-header/table-header.module';
import { XmDynamicTableComponent } from './components/xm-dynamic-table/xm-dynamic-table.component';
import { XM_TABLE_CONTROLLERS } from './controllers/providers';
import { XmTableDataLoaderService } from './data/xm-table-data-loader.service';
import { XmRequestBuilderService } from './requests/xm-request-builder.service';
import { XmTableSelectionService } from './selection/xm-table-selection.service';
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
        XmTableDynamicColumnsCellModule,
        LoadingBarModule,
        NoDataModule,
        TableHeaderModule,
    ],
    providers: [
        XM_TABLE_CONTROLLERS,
        XmTableSelectionService,
        XmRequestBuilderService,
        XmTableDataLoaderService,
        // { provide: 'STATIC', useClass: StaticDataSource },
        // { provide: 'ENTITY', useClass: EntityDataSource },
        // { provide: 'OBJECT', useClass: ObjectDataSource },
        // { provide: 'TMF-API', useClass: TmfApiDataSource },
        // { provide: 'API', useClass: ApiDataSource },
    ],
})
export class XmTableModule implements XmDynamicEntryModule {
    public entry: XmDynamicConstructor<XmTableComponent> = XmTableComponent;
}
