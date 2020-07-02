import { Injectable } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { Dashboard, Widget } from '@xm-ngx/dashboard';
import { DASHBOARD_API_URL, DASHBOARD_WIDGET_API_URL } from './const';

@Injectable()
export class DashboardCollection extends EntityCollectionBase<Dashboard> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_API_URL));
    }
}

@Injectable()
export class WidgetCollection extends EntityCollectionBase<Widget> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_WIDGET_API_URL));
    }
}
