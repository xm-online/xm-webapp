import { Component, ValueProvider } from '@angular/core';
import { DashboardCollection, DashboardConfig, WidgetCollection } from './injectors';
import { MatCardModule } from '@angular/material/card';
import { DashboardsListComponent } from './components/dashboards-list/dashboards-list.component';
import {
    DashboardEditComponent
} from './components/dashboard-edit/dashboard-edit.component';
import {
    EDIT_WIDGET_EVENT,
    WidgetEditComponent
} from './components/widget-edit/widget-edit.component';
import { EDIT_DASHBOARD_EVENT } from '@xm-ngx/administration/dashboards-config/const';

export const DASHBOARD_CONFIG_PROVIDER: ValueProvider = {
    provide: DashboardConfig,
    useValue: {
        dashboardRef: DashboardEditComponent,
        widgetRef: WidgetEditComponent,
        EDIT_DASHBOARD_EVENT: EDIT_DASHBOARD_EVENT,
        EDIT_WIDGET_EVENT: EDIT_WIDGET_EVENT,
    },
};

@Component({
    selector: 'xm-dashboards-config',
    standalone: true,
    providers: [
        DashboardCollection,
        WidgetCollection,
        DASHBOARD_CONFIG_PROVIDER
    ],
    imports: [DashboardsListComponent, MatCardModule],
    template: `
        <mat-card>
            <xm-dashboards-list></xm-dashboards-list>
        </mat-card>
    `,
})
export class DashboardsConfigComponent {
}
