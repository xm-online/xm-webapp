import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { StatesManagementDialogModule } from '@xm-ngx/entity/states-management-dialog';
import { XmTranslationModule } from '@xm-ngx/translation';
import { AceEditorModule } from '../../../../src/app/shared/directives/ace-editor.directive';
import { SpecificationManagementComponent } from './specification-management.component';
import { EntitySpecManagementComponent } from './entity-spec-management/entity-spec-management.component';
import { ConfigVisualizerDialogComponent } from './config-visualizer-dialog/config-visualizer-dialog.component';
import { EntitySpecEditorComponent } from './entity-spec-editor/entity-spec-editor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EntitySpecYamlService } from '@xm-ngx/administration/specification-management/entity-spec-editor/entity-spec-yaml.service';
import { MatDividerModule } from '@angular/material/divider';
import { StatesEditorComponent } from './entity-spec-editor/states-editor/states-editor.component';
import { MatListModule } from '@angular/material/list';
import { MultiLanguageModuleModule } from '@xm-ngx/components/xm-multilanguage/xm-multi-language.module';

@NgModule({
    imports: [
        XmTranslationModule,
        RouterModule,
        CommonModule,
        AceEditorModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatMenuModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule,
        StatesManagementDialogModule,
        MultiLanguageModuleModule,
    ],
    exports: [SpecificationManagementComponent],
    declarations: [
        SpecificationManagementComponent,
        ConfigVisualizerDialogComponent,
        EntitySpecManagementComponent,
        EntitySpecEditorComponent,
        StatesEditorComponent,
    ],
    providers: [EntitySpecYamlService],
})
export class SpecificationManagementModule {
    public entry: Type<SpecificationManagementComponent> = SpecificationManagementComponent;
}
