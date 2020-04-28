import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuditsModule } from '@xm-ngx/administration/audits';
import { adminState } from './admin.route';
import { ClientManagementModule } from './client-management';
import { ClientResolvePagingParams } from './client-management.route';
import { DocsModule } from './docs';
import { FormPlaygroundModule } from './form-playground';
import { GatewayModule } from './gateway';
import { HealthModule } from './health';
import { LogsModule } from './logs';
import { MaintenanceModule } from './maintenance';
import { MetricModule } from './metrics';
import { RolesManagementModule } from './roles-management';
import { RolesMatrixModule } from './roles-matrix';
import { TranslationModule } from './translations';
import { UserManagementModule } from './user-management';
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
        RouterModule.forChild(adminState)],
    declarations: [],
    providers: [
        UserResolvePagingParams,
        ClientResolvePagingParams,
    ],
})
export class XmAdminModule {
}
