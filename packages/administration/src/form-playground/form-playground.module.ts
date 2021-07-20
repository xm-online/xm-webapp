import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LanguageModule } from '@xm-ngx/components/language';
import { XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AceEditorModule, XmAceEditorControlModule } from '@xm-ngx/components/ace-editor';
import { FormPlaygroundComponent } from './form-playground.component';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        XmTranslationModule,
        FormsModule,
        NgxMatSelectSearchModule,
        CommonModule,
        MatCardModule,
        LanguageModule,
        XmJsonSchemaFormModule,
        ReactiveFormsModule,
        AceEditorModule,
        XmAceEditorControlModule,
    ],
    exports: [FormPlaygroundComponent],
    declarations: [FormPlaygroundComponent],
    providers: [],
})
export class FormPlaygroundModule {
    public entry: Type<FormPlaygroundComponent> = FormPlaygroundComponent;
}
