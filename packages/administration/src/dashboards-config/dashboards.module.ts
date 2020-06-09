import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { AceEditorControlModule } from '@xm-ngx/components/ace-editor-control';
import { XmBoolViewModule } from '@xm-ngx/components/xm-bool-view';
import { LoaderModule } from '@xm-ngx/components/loader';
import { TextModule } from '@xm-ngx/components/text';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmTranslationModule } from '@xm-ngx/translation';

import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardsConfigComponent } from './dashboards-config.component';
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

    ],
    entryComponents: [
        DashboardsConfigComponent,
        DashboardEditComponent,
        WidgetEditComponent,
    ],
    providers: [
        DashboardCollection,
        WidgetCollection,
    ],
})
export class DashboardsModule {
    public entry: Type<DashboardsConfigComponent> = DashboardsConfigComponent;
}
