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
export abstract class EntityCollectionWithHistory<T> extends EntityCollectionBase<T> {
    protected httpClient: HttpClient = inject<HttpClient>(HttpClient);

    constructor(factoryService: EntityCollectionFactoryService, private apiUrl: string) {
        super(factoryService.create(apiUrl));
    }

    public getHistoryById(id: number, pagination: { page: number; size: number } = { page: 0, size: 10 }): Observable<AuditResponse> {
        const { page, size } = pagination;
        const params = {
            page,
            size,
            sort: 'revtstmp,desc',
        };
        return this.httpClient.get<AuditResponse>(`${this.apiUrl}-audit/${id}`, {params});
    }
}

@Injectable({providedIn: 'root'})
export class DashboardCollection extends EntityCollectionWithHistory<Dashboard> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService, DASHBOARD_API_URL);
    }
}

@Injectable({providedIn: 'root'})
export class WidgetCollection extends EntityCollectionWithHistory<DashboardWidget> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService, DASHBOARD_WIDGET_API_URL);
    }
}
