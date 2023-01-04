import { Route } from '@angular/router';
import { MaintenanceComponent } from '@xm-ngx/administration/maintenance';

export const maintenanceRoute: Route = {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: {
        privileges: {value: ['ELASTICSEARCH.INDEX', 'CONFIG.ADMIN.REFRESH', 'CONFIG.CLIENT.REFRESH']},
        pageTitle: 'global.menu.admin.main',
        pageSubTitleTrans: 'global.menu.admin.maintenance',
    },
};
