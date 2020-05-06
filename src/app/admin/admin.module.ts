import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuditsModule } from '@xm-ngx/administration/audits';
import { adminState } from './admin.route';
import { ClientManagementModule } from '@xm-ngx/administration/client-management';
import { ClientResolvePagingParams } from './client-management.route';
import { DocsModule } from '@xm-ngx/administration/docs';
import { FormPlaygroundModule } from '@xm-ngx/administration/form-playground';
import { GatewayModule } from '@xm-ngx/administration/gateway';
import { HealthModule } from '@xm-ngx/administration/health';
import { LogsModule } from '@xm-ngx/administration/logs';
import { MaintenanceModule } from '@xm-ngx/administration/maintenance';
import { MetricModule } from '@xm-ngx/administration/metrics';
import { RolesManagementModule } from '@xm-ngx/administration/roles-management';
import { RolesMatrixModule } from '@xm-ngx/administration/roles-matrix';
import { TranslationModule } from '@xm-ngx/administration/translations';
import { UserManagementModule } from '@xm-ngx/administration/user-management';
import { DashboardResolvePagingParams } from './dashboard-mng.route';
import { UserResolvePagingParams } from './user-management.route';

@NgModule({
    imports: [
        AuditsModule,
        ClientManagementModule,
        DocsModule,
        FormPlaygroundModule,
        GatewayModule,
        HealthModule,
        LogsModule,
        MaintenanceModule,
        MetricModule,
        RolesManagementModule,
        RolesMatrixModule,
        TranslationModule,
        UserManagementModule,
        RouterModule.forChild(adminState),
    ],
    declarations: [],
    providers: [
        UserResolvePagingParams,
        ClientResolvePagingParams,
        DashboardResolvePagingParams,
    ],
})
export class XmAdminModule {
}
