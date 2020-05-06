import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { StatesManagementDialogModule } from '@xm-ngx/entity/states-management-dialog';
import { XmTranslationModule } from '@xm-ngx/translation';
import { AceEditorModule } from '../../../../src/app/shared/directives/ace-editor.directive';
import { SpecificationMngComponent } from './specification-mng.component';
import { EntitySpecMngComponent } from './entity-spec-mng/entity-spec-mng.component';
import { ConfigVisualizerDialogComponent } from './config-visualizer-dialog/config-visualizer-dialog.component';

@NgModule({
    imports: [
        XmTranslationModule,
        RouterModule,
        CommonModule,
        AceEditorModule,
        MatButtonModule,
        MatIconModule,
        StatesManagementDialogModule,
    ],
    exports: [SpecificationMngComponent],
    declarations: [SpecificationMngComponent, ConfigVisualizerDialogComponent, EntitySpecMngComponent],
    providers: [],
})
export class SpecificationMngModule {
    public entry: Type<SpecificationMngComponent> = SpecificationMngComponent;
}
