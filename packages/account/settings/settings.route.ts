import { Route } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/auth';
import { SettingsComponent } from './settings.component';

export const settingsRoute: Route = {
    path: 'settings',
    component: SettingsComponent,
    data: {
        privileges: {value: ['ACCOUNT.GET_LIST.ITEM']},
        pageTitle: 'global.menu.account.settings',
    },
    canActivate: [UserRouteAccessService],
};
