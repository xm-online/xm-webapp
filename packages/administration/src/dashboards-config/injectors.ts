import { Injectable, Type } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { Dashboard, DashboardWidget } from '@xm-ngx/dashboard';
import { DASHBOARD_API_URL, DASHBOARD_WIDGET_API_URL } from './const';

export class DashboardConfig {
    public dashboardRef: Type<unknown>;
    public widgetRef: Type<unknown>;
    public EDIT_DASHBOARD_EVENT: string;
    public EDIT_WIDGET_EVENT: string;
}

@Injectable()
export class DashboardCollection extends EntityCollectionBase<Dashboard> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_API_URL));
    }
}

@Injectable()
export class WidgetCollection extends EntityCollectionBase<DashboardWidget> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_WIDGET_API_URL));
    }
}
