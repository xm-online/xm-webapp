import { DashboardWidget } from '../../models/dashboard-widget.model';
import { getWidgetComponent, getWidgetsComponent } from './widgets-path_backward-compatibility';
import * as _ from 'lodash';
import { sortByOrderIndex } from './sortByOrderIndex';
import { Dashboard, DashboardLayoutLayout } from '../../models/dashboard.model';
import { XmLogger } from '@xm-ngx/logger';


export class DashboardBase {

    constructor(protected logger: XmLogger) {
    }

    private static defaultGrid(el: DashboardWidget): DashboardLayoutLayout {
        return {
            class: 'row mx-md-0',
            selector: null,
            content: [
                {
                    class: 'col-sm-12',
                    selector: null,
                    widget: el,
                },
            ],
        };
    }

    /** @deprecated Back compatibility */
    protected getWidgetComponent(widget: DashboardWidget | any = {}): DashboardWidget {
        return getWidgetComponent(widget);
    }

    /** @deprecated Back compatibility */
    protected getWidgetsComponent(widgets: DashboardWidget[]): DashboardWidget[] {
        return getWidgetsComponent(widgets);
    }

    protected loadDashboard<T extends Dashboard = Dashboard>(page: T): T {
        const dashboard = _.cloneDeep(page);

        const widgets = sortByOrderIndex(dashboard.widgets || []);
        dashboard.widgets = this.getWidgetsComponent(widgets);

        if (dashboard.layout && dashboard.layout.layout) {
            this.findAndEnrichWidget(dashboard.layout.layout, widgets);
            dashboard.layout.grid = dashboard.layout.layout as DashboardLayoutLayout[];
        } else {
            dashboard.layout = {};
            dashboard.layout.grid = widgets.map((w) => DashboardBase.defaultGrid(w));
        }
        return dashboard;
    }

    private findAndEnrichWidget(layout: any, widgets: DashboardWidget[]): void {
        Object.keys(layout).forEach((k) => {
            if (k === 'widget') {
                layout.widget = widgets.find((w) => w.id === layout[k]);
            }

            if (k === 'widgetName') {
                layout.widget = widgets.find((w) => w.name === layout[k]);
                if (!layout.widget) {
                    this.logger.error('The dashboard layout has a reference to the non-existing widget '
                        + `widgetName=${layout[k]}.`);
                }
            }

            if (layout[k] && typeof layout[k] === 'object') {
                this.findAndEnrichWidget(layout[k], widgets);
            }
        });
    }

}
