import { inject, Injectable, Type } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';

import { DASHBOARD_API_URL, DASHBOARD_WIDGET_API_URL } from './const';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuditResponse } from '../dashboards-config/configuration-history/models/config-history.model';

export class DashboardConfig {
    public dashboardRef: Type<unknown>;
    public widgetRef: Type<unknown>;
    public EDIT_DASHBOARD_EVENT: string;
    public EDIT_WIDGET_EVENT: string;
}

@Injectable()
export class DashboardCollection extends EntityCollectionBase<Dashboard> {
    private httpClient: HttpClient = inject<HttpClient>(HttpClient);
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_API_URL));
    }
    public getHistoryById(id: number): Observable<AuditResponse> {
        return this.httpClient.get<AuditResponse>(`dashboard/api/dashboards-audit/${id}`);
    }
}

@Injectable()
export class WidgetCollection extends EntityCollectionBase<DashboardWidget> {
    private httpClient: HttpClient = inject<HttpClient>(HttpClient);
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_WIDGET_API_URL));
    }
    public getHistoryById(id: number): Observable<AuditResponse> {
        return this.httpClient.get<AuditResponse>(`dashboard/api/widgets-audit/${id}`);
    }
}
