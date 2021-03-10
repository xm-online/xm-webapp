import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { Dashboard, DashboardWidget } from '@xm-ngx/dashboard';

@Injectable()
export class DashboardsManagerService {
    public activeDashboard: Dashboard;
    public activeWidget: DashboardWidget;

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
    ) {
    }

    public setActiveDashboard(dashboard: Dashboard): void {
        this.saveActiveToParams();
    }

    public setActiveWidget(widget: XmDynamicWidget): void {
        this.saveActiveToParams();
    }

    private saveActiveToParams(): void {
        this.saveRoute({
            dashboardId: this.activeDashboard?.id,
            widgetId: this.activeWidget?.id,
        });
    }

    private saveRoute(queryParams: unknown): void {
        this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams,
            queryParamsHandling: 'merge',
        });
    }
}
