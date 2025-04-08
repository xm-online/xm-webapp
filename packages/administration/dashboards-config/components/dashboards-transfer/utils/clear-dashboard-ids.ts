import { DashboardWidget, DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { DashboardWithWidgetsPayloadType } from '../types';
import { cloneDeep } from 'lodash';

export const clearDashboardIds = (dashboards: DashboardWithWidgets[]): DashboardWithWidgetsPayloadType[] => {
    return dashboards.map((dashboard: DashboardWithWidgets) => {
        const dashboardCopy = cloneDeep(dashboard);

        delete dashboardCopy.id;

        (dashboardCopy?.widgets || []).forEach((widget: DashboardWidget) => {
            delete widget.id;
            delete widget.dashboard;
        });

        return dashboardCopy;
    });
};
