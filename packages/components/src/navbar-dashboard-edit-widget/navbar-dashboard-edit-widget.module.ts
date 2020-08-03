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
} from '@xm-ngx/components/navbar-dashboard-edit-widget/navbar-dashboard-edit-widget.component';
import { XmSharedModule } from '@xm-ngx/shared';


@NgModule({
    imports: [XmSharedModule, DashboardsModule],
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
