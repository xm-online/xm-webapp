import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MaintenanceComponent } from './maintenance.component';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ExportEntitiesDetailsComponent } from './export-entities-details/export-entities-details.component';
import { LoaderModule } from '@xm-ngx/components/loader';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ExportSelectedEntitiesPipe } from './export-selected-entities.pipe';
import { ImportEntitiesDetailsComponent } from './import-entities-details/import-entities-details.component';

@NgModule({
    imports: [
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        CommonModule,
        XmPermissionModule,
        XmTranslationModule,
        LoaderModule,
        ModalCloseModule,
        MatDialogModule,
        MatListModule,
        CdkTreeModule,
        MatCheckboxModule,
        MatTreeModule,
        MatFormFieldModule,
        FormsModule,
    ],
    exports: [MaintenanceComponent],
    declarations: [MaintenanceComponent, ExportEntitiesDetailsComponent, ExportSelectedEntitiesPipe, ImportEntitiesDetailsComponent],
    providers: [],
})
export class MaintenanceModule {
    public entry: Type<MaintenanceComponent> = MaintenanceComponent;
}
