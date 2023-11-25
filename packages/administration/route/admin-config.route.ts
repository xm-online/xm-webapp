import { Route } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { specificationMngRoute } from './specification-mng.route';


export const ADMIN_CONFIG_ROUTE: Route = {
    path: '',
    data: {
        authorities: ['ROLE_ADMIN'],
    },
    canActivateChild: [UserRouteAccessService],
    children: [specificationMngRoute],
};
