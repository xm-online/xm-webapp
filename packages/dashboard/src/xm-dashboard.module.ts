import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmSharedModule } from '@xm-ngx/shared';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { DashboardService } from '@xm-ngx/core/dashboard';
import { WidgetService } from '@xm-ngx/core/dashboard';
import { XmDashboardRoutingModule } from './xm-dashboard-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [
        XmDynamicModule,
        CommonModule,
        XmSharedModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        XmDashboardRoutingModule,
        LoaderModule,
        NoDataModule,
        MatCardModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatRippleModule,
    ],
    declarations: [DashboardComponent],
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
