import { Injectable, signal } from '@angular/core';
import { Dashboard, DashboardWidget, DashboardLayoutLayout } from '@xm-ngx/core/dashboard';
import { XmLoggerService, XmLogger } from '@xm-ngx/logger';
import { getWidgetsComponent, sortByOrderIndex } from '@xm-ngx/dashboard';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class DashboardPreviewService {
    private previewDashboard = signal<Dashboard | null>(null);

    public readonly dashboard = this.previewDashboard.asReadonly();

    protected logger: XmLogger;

    constructor(loggerService: XmLoggerService) {
        this.logger = loggerService.create({ name: 'DashboardPreviewService' });
    }

    public setPreviewDashboard(dashboard: Dashboard): void {
        if (!dashboard) {
            this.previewDashboard.set(null);
            return;
        }

        const isolatedDashboard = cloneDeep(dashboard);
        const processedDashboard = this.loadDashboard(isolatedDashboard);
        const finalDashboard = cloneDeep(processedDashboard);

        this.previewDashboard.set(finalDashboard);
    }

    public clearPreview(): void {
        this.previewDashboard.set(null);
    }

    public getCurrentPreview(): Dashboard | null {
        const current = this.previewDashboard();
        return current ? cloneDeep(current) : null;
    }

    private loadDashboard<T extends Dashboard = Dashboard>(page: T): T {
        const dashboard = page;
        const originalWidgets = dashboard.widgets || [];

        const widgets = sortByOrderIndex(cloneDeep(originalWidgets));
        const processedWidgets = getWidgetsComponent(widgets);
        dashboard.widgets = cloneDeep(processedWidgets);

        const widgetsForEnrichment = cloneDeep(dashboard.widgets);

        if (dashboard.layout && dashboard.layout.layout) {
            const layoutCopy = cloneDeep(dashboard.layout.layout);
            this.findAndEnrichWidget(layoutCopy, widgetsForEnrichment);
            dashboard.layout.grid = layoutCopy as DashboardLayoutLayout[];
        } else {
            dashboard.layout = dashboard.layout || {};
            dashboard.layout.grid = widgetsForEnrichment.map((w) => this.defaultGrid(w));
        }

        return dashboard;
    }

    private defaultGrid(el: DashboardWidget): DashboardLayoutLayout {
        return {
            class: 'row mx-md-0',
            selector: null,
            content: [
                {
                    class: 'col-sm-12',
                    selector: null,
                    widget: cloneDeep(el),
                },
            ],
        };
    }


    private findAndEnrichWidget(layout: any, widgets: DashboardWidget[]): void {
        if (!layout || typeof layout !== 'object') {
            return;
        }

        Object.keys(layout).forEach((k) => {
            if (k === 'widget' && layout[k]) {
                const foundWidget = widgets.find((w) => w.id === layout[k]);
                layout.widget = foundWidget ? cloneDeep(foundWidget) : layout[k];
            }

            if (k === 'widgetName' && layout[k]) {
                const foundWidget = widgets.find((w) => w.name === layout[k]);
                if (foundWidget) {
                    layout.widget = cloneDeep(foundWidget);
                } else {
                    this.logger.error(
                        'The dashboard layout has a reference to the non-existing widget ' +
                        `widgetName=${layout[k]}.`
                    );
                }
            }

            if (layout[k] && typeof layout[k] === 'object') {
                this.findAndEnrichWidget(layout[k], widgets);
            }
        });
    }

}