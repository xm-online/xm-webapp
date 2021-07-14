import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmSharedModule } from '@xm-ngx/shared';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { DashboardStore } from './stores/dashboard-store.service';
import { DashboardService } from './repositories/dashboard.service';
import { WidgetService } from './repositories/widget.service';
import { XmDashboardRoutingModule } from './xm-dashboard-routing.module';

@NgModule({
    imports: [
        XmDynamicModule,
        CommonModule,
        XmSharedModule,
        XmDashboardRoutingModule,
        LoaderModule,
        NoDataModule,
    ],
    declarations: [DashboardComponent],
    exports: [],
    providers: [WidgetService, PendingChangesGuard],
})
export class XmDashboardModule {
    public static forRoot(): ModuleWithProviders<XmDashboardModule> {
        return {
            ngModule: XmDashboardModule,
            providers: [
                DashboardService,
                DashboardStore,
            ],
        };
    }
}
