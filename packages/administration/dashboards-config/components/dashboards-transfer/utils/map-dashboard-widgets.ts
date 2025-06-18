import { DashboardWidget, DashboardWithWidgets } from '@xm-ngx/core/dashboard';

export const mapDashboardWidgets = (dashboards: DashboardWithWidgets[]) => {
    return (widgetDictionary: Map<number, DashboardWidget[]>): DashboardWithWidgets[] => {
        return dashboards.map((dashboard: DashboardWithWidgets) => ({
            ...dashboard,
            widgets: widgetDictionary.get(dashboard.id) || [],
        }));
    };
};

