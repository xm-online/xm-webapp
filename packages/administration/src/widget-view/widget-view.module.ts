import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { WidgetSelectorTextControlModule } from '@xm-ngx/administration/dashboards-config/widget-edit/selector-text-control/selector-text-control.component';
import { AceEditorControlModule } from '@xm-ngx/components/xm-ace-editor/xm-ace-editor-control';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { WidgetViewComponent } from './widget-view.component';


@NgModule({
    declarations: [WidgetViewComponent],
    imports: [
        CommonModule,
        WidgetSelectorTextControlModule,
        ReactiveFormsModule,
        XmDynamicModule,
        AceEditorControlModule,
        MatButtonModule,
        XmTranslationModule,
    ],
})
export class WidgetViewModule {
    public entry: Type<WidgetViewComponent> = WidgetViewComponent;
}
