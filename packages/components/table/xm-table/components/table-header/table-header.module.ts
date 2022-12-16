import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormLayoutModule } from '@xm-ngx/components/form-layout';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatModule } from '../../../../../../src/app/mat.module';
import { TableActionsButtonsComponent } from './table-actions-buttons/table-actions-buttons.component';
import { TableFilterChipsComponent } from './table-filter-chips/table-filter-chips.component';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { TableHeaderComponent } from './table-header.component';
import { FilterDialogComponent } from './table-filter/filter-dialog/filter-dialog.component';


@NgModule({
    declarations: [
        TableHeaderComponent,
        TableFilterComponent,
        TableFilterChipsComponent,
        TableActionsButtonsComponent,
        FilterDialogComponent,
    ],
    imports: [
        CommonModule,
        XmTranslationModule,
        XmDynamicModule,
        MatModule,
        FormLayoutModule,
    ],
    exports: [TableHeaderComponent],
})
export class TableHeaderModule {
    public entry: Type<TableHeaderComponent> = TableHeaderComponent;
}
