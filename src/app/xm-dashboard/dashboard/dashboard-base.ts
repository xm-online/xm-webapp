import { DashboardWidget } from '@xm-ngx/dashboard';
import { getWidgetComponent, getWidgetsComponent } from './widgets-path_backward-compatibility';

export class DashboardBase {

    /** @deprecated Back compatibility */
    protected getWidgetComponent(widget: DashboardWidget = {}): DashboardWidget {
        return getWidgetComponent(widget);
    }

    /** @deprecated Back compatibility */
    protected getWidgetsComponent(widgets: DashboardWidget[]): DashboardWidget[] {
        return getWidgetsComponent(widgets);
    }
}
