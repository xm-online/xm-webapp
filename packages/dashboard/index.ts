export { DashboardComponent } from './src/components/dashboard/dashboard.component';
export { DashboardBase } from './src/components/dashboard/dashboard-base';
export { getOrderIndex, sortByOrderIndex, swapByOrderIndex } from './src/components/dashboard/sortByOrderIndex';
export { getWidgetsComponent, getWidgetComponent } from './src/components/dashboard/widgets-path_backward-compatibility';

export { DashboardGuard } from './src/guards/dashboard.guard';
export { PendingChangesGuard } from './src/guards/pending-changes.guard';
export { XmDashboardDynamicRouteResolverGuard } from './src/dynamic-route/xm-dashboard-dynamic-route-resolver-guard.service';

export {
    Dashboard,
    DashboardConfig,
    DashboardLayout,
    DashboardLayoutLayout,
    DashboardWithWidgets,
} from './src/models/dashboard.model';
export { DashboardWidget } from './src/models/dashboard-widget.model';

export { DashboardService } from './src/repositories/dashboard.service';
export { WidgetService } from './src/repositories/widget.service';

export { DefaultDashboardService } from './src/services/default-dashboard.service';

export { PageService, Page } from './src/stores/page/page.service';
export { PageLocationService } from './src/stores/page-location/page-location.service';
export { PageChangesStore, PageChangesStoreType } from './src/stores/page-changes-store';
export { DashboardStore } from './src/stores/dashboard-store.service';
export { DashboardWrapperService } from './src/stores/dashboard-wrapper.service';

export { XmDashboardModule } from './src/xm-dashboard.module';
