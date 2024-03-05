import { Route } from '@angular/router';
import { DashboardsConfigComponent } from '@xm-ngx/administration/dashboards-config';

export const DASHBOARDS_ROUTE: Route = {
    path: 'dashboard-management',
    component: DashboardsConfigComponent,
    data: {
        privileges: {value: ['DASHBOARD.CREATE']},
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.metrics',
    },
};
