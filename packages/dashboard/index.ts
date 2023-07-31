export { DashboardComponent } from './src/components/dashboard/dashboard.component';
export { DashboardBase } from './src/components/dashboard/dashboard-base';
export { getOrderIndex, sortByOrderIndex, swapByOrderIndex } from './src/components/dashboard/sortByOrderIndex';
export { getWidgetsComponent, getWidgetComponent } from './src/components/dashboard/widgets-path_backward-compatibility';

export { DashboardGuard } from './src/guards/dashboard.guard';
export { PendingChangesGuard } from './src/guards/pending-changes.guard';
export { XmDashboardDynamicRouteResolverGuard } from './src/dynamic-route/xm-dashboard-dynamic-route-resolver-guard.service';

export * from '@xm-ngx/core/dashboard';

export { DefaultDashboardService } from './src/services/default-dashboard.service';


export { XmDashboardModule } from './src/xm-dashboard.module';

export { DynamicContextComponent } from './src/components/dynamic-context/dynamic-context.component';