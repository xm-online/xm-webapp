import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmDynamicControllerInjectorFactoryService, XmDynamicModule } from '@xm-ngx/dynamic';
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
import { XmNotEmptyPipe } from '@xm-ngx/pipes';
import { ChangeableDirective } from './changeable/changeable.directive';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import {
    VisualConstructorComponent
} from '@xm-ngx/dashboard/src/components/dashboard/visual-constructor/visual-constructor/visual-constructor.component';
@NgModule({
    imports: [
        XmDynamicModule,
        CommonModule,
        XmSharedModule,
        XmDashboardRoutingModule,
        LoaderModule,
        NoDataModule,
        MatCardModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        XmNotEmptyPipe,
        ChangeableDirective,
        CdkDrag,
        CdkDropList,
        CdkDropListGroup,
        CdkDragHandle,
        VisualConstructorComponent,
    ],
    declarations: [DashboardComponent],
    providers: [WidgetService, PendingChangesGuard, XmDynamicControllerInjectorFactoryService],
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
