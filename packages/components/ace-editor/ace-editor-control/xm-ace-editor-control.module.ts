import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmAceEditorThemeSchemeAdapterModule } from '../xm-ace-editor-theme-scheme-adapter.directive';
import { AceEditorModule } from '../xm-ace-editor.directive';
import { XmAceEditorControlComponent } from './xm-ace-editor-control';

@NgModule({
    imports: [
        XmTranslationModule,
        AceEditorModule,
        CommonModule,
        MatFormFieldModule,
        ControlErrorModule,
        XmAceEditorThemeSchemeAdapterModule,
    ],
    exports: [XmAceEditorControlComponent],
    declarations: [XmAceEditorControlComponent],
})
export class XmAceEditorControlModule {
    public entry: Type<XmAceEditorControlComponent> = XmAceEditorControlComponent;
}
