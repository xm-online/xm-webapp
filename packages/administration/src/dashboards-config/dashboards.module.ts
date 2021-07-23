import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EDIT_DASHBOARD_EVENT } from '@xm-ngx/administration/dashboards-config/const';
import { XmAceEditorControlModule } from '@xm-ngx/components/ace-editor';
import { XmBoolModule } from '@xm-ngx/components/bool';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTextControlModule } from '@xm-ngx/components/text';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmDocExamplesModule } from '../../../documentation/doc-examples/xm-doc-examples.module';

import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardsConfigComponent } from './dashboards-config.component';
import { DashboardsListExpandComponent } from './dashboards-list/dashboards-list-expand/dashboards-list-expand.component';
import { DashboardsListComponent } from './dashboards-list/dashboards-list.component';

import { DashboardCollection, DashboardConfig, WidgetCollection } from './injectors';
import { SelectorTextControlComponent } from './widget-edit/selector-text-control/selector-text-control.component';
import { EDIT_WIDGET_EVENT, WidgetEditComponent } from './widget-edit/widget-edit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { XmExpansionIndicatorModule } from '@xm-ngx/components/expansion-indicator';

@NgModule({
    imports: [
        XmTranslationModule,
        CommonModule,
        XmSharedModule,
        LoaderModule,
        XmBoolModule,
        XmAceEditorControlModule,
        XmTextControlModule,
        RouterModule,
        XmDocExamplesModule,
        DragDropModule,
        XmExpansionIndicatorModule,
    ],
    exports: [
        DashboardsConfigComponent,
        DashboardEditComponent,
        WidgetEditComponent,
    ],
    declarations: [
        DashboardsConfigComponent,
        WidgetEditComponent,
        DashboardEditComponent,
        DashboardsListComponent,
        DashboardsListExpandComponent,
        SelectorTextControlComponent,
    ],
    providers: [
        DashboardCollection,
        WidgetCollection,
        {
            provide: DashboardConfig,
            useValue: {
                dashboardRef: DashboardEditComponent,
                widgetRef: WidgetEditComponent,
                EDIT_DASHBOARD_EVENT: EDIT_DASHBOARD_EVENT,
                EDIT_WIDGET_EVENT: EDIT_WIDGET_EVENT,
            },
        },
    ],
})
export class DashboardsModule {
    public entry: Type<DashboardsConfigComponent> = DashboardsConfigComponent;
}
