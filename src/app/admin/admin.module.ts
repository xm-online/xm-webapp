import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { TagInputModule } from 'ngx-chips';
import { AuditsModule } from '@xm-ngx/administration/audits';
import { XmSharedModule } from '../shared/shared.module';
import {
    BaseAdminListComponent,
    ClientMgmtComponent,
    ClientMgmtDeleteDialogComponent,
    ClientMgmtDialogComponent,
    ClientResolvePagingParams,
    GatewayRoutesService,
    JhiDocsComponent,
    JhiGatewayComponent,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiHealthService,
    JhiMetricsMonitoringComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsService,
    LogsComponent,
    LogsService,
    RoleConditionDialogComponent,
    RoleMgmtDeleteDialogComponent,
    RoleMgmtDetailComponent,
    RoleMgmtDialogComponent,
    RolesMatrixComponent,
    RolesMgmtComponent,
    RolesResolve,
    UserLoginMgmtDialogComponent,
    UserMgmtComponent,
    UserMgmtDeleteDialogComponent,
    UserMgmtDetailComponent,
    UserMgmtDialogComponent,
    UserModalService,
    UserResolve,
    UserResolvePagingParams,
} from './';
import { XmConfigService } from './../shared/spec/config.service';
import { adminState } from './admin.route';
import { FormPlaygroundComponent } from './form-playground/form-playground.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { TranslationComponent } from './translations/translation.component';
import { TranslationService } from './translations/translation.service';

@NgModule({
    imports: [
        CommonModule,
        AuditsModule,
        TagInputModule,
        XmSharedModule,
        FormsModule,
        RouterModule.forChild(adminState),
    ],
    declarations: [
        RolesMgmtComponent,
        RoleMgmtDetailComponent,
        RoleMgmtDialogComponent,
        RoleMgmtDeleteDialogComponent,
        RoleConditionDialogComponent,
        RolesMatrixComponent,
        ClientMgmtComponent,
        ClientMgmtDialogComponent,
        ClientMgmtDeleteDialogComponent,
        UserMgmtComponent,
        UserLoginMgmtDialogComponent,
        UserMgmtDetailComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        LogsComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        FormPlaygroundComponent,
        MaintenanceComponent,
        TranslationComponent,
        JhiDocsComponent,
        JhiGatewayComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        BaseAdminListComponent,
        JhiHealthService,
        JhiMetricsService,
        GatewayRoutesService,
        LogsService,
        RolesResolve,
        UserResolvePagingParams,
        UserResolve,
        UserModalService,
        ClientResolvePagingParams,
        XmConfigService,
        TranslationService,
    ],
})
export class XmAdminModule {
}
