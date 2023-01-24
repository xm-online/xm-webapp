import { Route } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { PasswordSettingsComponent } from '../password-settings/password-settings.component';

export const passwordRoute: Route = {
    path: 'password',
    component: PasswordSettingsComponent,
    data: {
        privileges: {value: ['ACCOUNT.PASSWORD.UPDATE']},
        pageTitle: 'global.menu.account.password',
    },
    canActivate: [UserRouteAccessService],
};
