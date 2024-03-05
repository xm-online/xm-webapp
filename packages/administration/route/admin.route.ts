import { Routes } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { ADMIN_CONFIG_ROUTE } from './admin-config.route';
import { auditsRoute } from './audits.route';
import { clientMgmtRoute } from './client-management.route';
import { docsRoute } from './docs.route';
import { formPlaygroundRoute } from './form-playground.route';
import { gatewayRoute } from './gateway.route';
import { healthRoute } from './health.route';
import { logsRoute } from './logs.route';
import { maintenanceRoute } from './maintenance.route';
import { metricsRoute } from './metrics.route';
import { rolesMgmtRoute } from './roles-management.route';
import { rolesMatrixRoute } from './roles-matrix.route';
import { translationRoute } from './translation.route';
import { userMgmtRoute } from './user-management.route';
import { DASHBOARDS_ROUTE } from './dashboards.route';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        data: {
            authorities: ['ROLE_ADMIN'],
        },
        // canActivate: [UserRouteAccessService],
        canActivateChild: [UserRouteAccessService],
        children: [
            auditsRoute,
            docsRoute,
            healthRoute,
            formPlaygroundRoute,
            maintenanceRoute,
            translationRoute,
            logsRoute,
            gatewayRoute,
            rolesMatrixRoute,
            ...userMgmtRoute,
            ...clientMgmtRoute,
            ...rolesMgmtRoute,
            metricsRoute,
            ADMIN_CONFIG_ROUTE,
            DASHBOARDS_ROUTE
        ]
    },
];
