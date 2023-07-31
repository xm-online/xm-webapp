import { NgModule, Type } from '@angular/core';
import { DashboardsModule, } from '@xm-ngx/administration/dashboards-config';
import { NavbarDashboardEditWidgetComponent, } from './navbar-dashboard-edit-widget.component';
import { XmSharedModule } from '@xm-ngx/shared';
import { AsyncPipe } from '@angular/common';

@NgModule({
    imports: [XmSharedModule, DashboardsModule, AsyncPipe],
    exports: [NavbarDashboardEditWidgetComponent],
    declarations: [NavbarDashboardEditWidgetComponent],
})
export class NavbarDashboardEditWidgetModule {
    public entry: Type<NavbarDashboardEditWidgetComponent> = NavbarDashboardEditWidgetComponent;
}
