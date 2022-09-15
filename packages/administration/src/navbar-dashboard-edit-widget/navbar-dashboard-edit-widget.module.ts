import { NgModule, Type } from '@angular/core';
import {
    DashboardEditComponent,
    DashboardsModule,
    WidgetEditComponent,
} from '@xm-ngx/administration/dashboards-config';
import { DashboardConfig } from '@xm-ngx/administration/dashboards-config/injectors';
import {
    NAVBAR_EDIT_DASHBOARD_EVENT,
    NAVBAR_EDIT_WIDGET_EVENT,
    NavbarDashboardEditWidgetComponent,
} from './navbar-dashboard-edit-widget.component';
import { XmSharedModule } from '@xm-ngx/shared';

import {
    SchemaFormModule,
} from "ngx-schema-form";

@NgModule({
    imports: [XmSharedModule, DashboardsModule, SchemaFormModule],
    exports: [NavbarDashboardEditWidgetComponent],
    declarations: [NavbarDashboardEditWidgetComponent],
    providers: [
        {
            provide: DashboardConfig,
            useValue: {
                dashboardRef: DashboardEditComponent,
                widgetRef: WidgetEditComponent,
                EDIT_DASHBOARD_EVENT: NAVBAR_EDIT_DASHBOARD_EVENT,
                EDIT_WIDGET_EVENT: NAVBAR_EDIT_WIDGET_EVENT,
            },
        },
    ],
})
export class NavbarDashboardEditWidgetModule {
    public entry: Type<NavbarDashboardEditWidgetComponent> = NavbarDashboardEditWidgetComponent;
}
