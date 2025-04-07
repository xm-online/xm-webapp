import { DashboardWidget } from '@xm-ngx/core/dashboard';

export const createWidgetDictionary = (widgets: DashboardWidget[]): Map<number, DashboardWidget[]> => {
    const map = new Map<number, DashboardWidget[]>();

    widgets.forEach((widget: DashboardWidget) => {
        const id = widget.dashboard as number;

        if (!map.has(id)) {
            map.set(id, []);
        }

        const values: DashboardWidget[] = map.get(id);
        values.push(widget);

        map.set(id, values);
    });

    return map;
};
