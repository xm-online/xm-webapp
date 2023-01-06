import { Routes } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/auth';
import { specificationMngRoute } from './specification-mng.route';

const ADMIN_CONFIG_ROUTES = [
    ...specificationMngRoute,
];

export const adminConfigState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN'],
    },
    canActivateChild: [UserRouteAccessService],
    children: ADMIN_CONFIG_ROUTES,
},
];
