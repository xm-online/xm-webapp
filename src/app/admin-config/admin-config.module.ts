import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatesManagementDialogModule } from '@xm-ngx/entity/states-management-dialog';
import { XmSharedModule } from '../shared/shared.module';
import { adminConfigState } from './admin-config.route';
import { DashboardDetailDialogComponent } from './dashboard-mng/dashboard-detail-dialog/dashboard-detail-dialog.component';
import { DashboardListCardComponent } from './dashboard-mng/dashboard-list-card/dashboard-list-card.component';
import { DashboardResolvePagingParams } from './dashboard-mng/dashboard-mng.route';
import { WidgetDetailDialogComponent } from './dashboard-mng/widget-detail-dialog/widget-detail-dialog.component';
import { WidgetListCardComponent } from './dashboard-mng/widget-list-card/widget-list-card.component';
import { ConfigVisualizerDialogComponent } from './specification-mng/config-visualizer-dialog/config-visualizer-dialog.component';
import { EntitySpecMngComponent } from './specification-mng/entity-spec-mng/entity-spec-mng.component';
import { SpecificationMngComponent } from './specification-mng/specification-mng.component';

@NgModule({
    imports: [
        StatesManagementDialogModule,
        CommonModule,
        RouterModule.forChild(adminConfigState),
        XmSharedModule,
    ],
    declarations: [
        DashboardDetailDialogComponent,
        DashboardListCardComponent,
        ConfigVisualizerDialogComponent,
        SpecificationMngComponent,
        WidgetDetailDialogComponent,
        WidgetListCardComponent,
        EntitySpecMngComponent,
    ],
    entryComponents: [
        DashboardDetailDialogComponent,
        ConfigVisualizerDialogComponent,
        SpecificationMngComponent,
        WidgetDetailDialogComponent,
    ],
    providers: [
        DashboardResolvePagingParams,
    ],
})
export class XmAdminConfigModule {
}
