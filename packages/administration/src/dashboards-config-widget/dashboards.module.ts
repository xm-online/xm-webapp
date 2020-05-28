import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { AceEditorControlModule } from '@xm-ngx/components/ace-editor-control';
import { XmBoolViewModule } from '@xm-ngx/components/xm-bool-view';
import { LoaderModule } from '@xm-ngx/components/loader';
import { TextModule } from '@xm-ngx/components/text';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmTranslationModule } from '@xm-ngx/translation';

import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardsConfigWidgetComponent } from './dashboards-config-widget.component';
import { DashboardsListExpandComponent } from './dashboards-list/dashboards-list-expand/dashboards-list-expand.component';
import { DashboardsListComponent } from './dashboards-list/dashboards-list.component';

import { DashboardCollection, WidgetCollection } from './injectors';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';

@NgModule({
    imports: [
        XmTranslationModule,
        CommonModule,
        XmSharedModule,
        LoaderModule,
        XmBoolViewModule,
        AceEditorControlModule,
        TextModule,
    ],
    exports: [
        DashboardsConfigWidgetComponent,
        DashboardEditComponent,
        WidgetEditComponent,
    ],
    declarations: [
        DashboardsConfigWidgetComponent,
        WidgetEditComponent,
        DashboardEditComponent,
        DashboardsListComponent,
        DashboardsListExpandComponent,

    ],
    entryComponents: [
        DashboardsConfigWidgetComponent,
        DashboardEditComponent,
        WidgetEditComponent,
    ],
    providers: [
        DashboardCollection,
        WidgetCollection,
    ],
})
export class DashboardsModule {
    public entry: Type<DashboardsConfigWidgetComponent> = DashboardsConfigWidgetComponent;
}
