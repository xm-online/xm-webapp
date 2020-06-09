import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dashboard, IWidget, Widget } from '@xm-ngx/dynamic';

@Injectable()
export class DashboardsManagerService {
    public activeDashboard: Dashboard;
    public activeWidget: Widget;

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
    ) {
        this.loadActivefromParams();
    }

    public setActiveDashboard(dashboard: Dashboard): void {
        this.activeDashboard = dashboard;
        this.saveActiveToParams();
    }

    public setActiveWidget(widget: IWidget): void {
        this.activeWidget = widget;
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

    private loadActivefromParams(): void {
        type _Params = { dashboardId?: string; widgetId?: string };
        const queryParams: _Params = this.activatedRoute.snapshot.queryParams || {};
        if (queryParams.dashboardId) {
            this.activeDashboard = {id: Number(queryParams.dashboardId)};
        }
        if (queryParams.widgetId) {
            this.activeWidget = {id: Number(queryParams.widgetId)};
        }
    }
}
