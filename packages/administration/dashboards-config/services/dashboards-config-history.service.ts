import { inject, Injectable } from '@angular/core';
import { DashboardCollection, WidgetCollection } from '@xm-ngx/administration/dashboards-config';
import { map, Observable } from 'rxjs';
import { AuditResponse, HistoryEvent } from '@xm-ngx/administration/dashboards-config/configuration-history/models/config-history.model';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class DashboardsConfigHistoryService {
    private dashboardCollection: DashboardCollection = inject<DashboardCollection>(DashboardCollection);
    private widgetCollection: WidgetCollection = inject<WidgetCollection>(WidgetCollection);

    private dashboardHistory$: (id: number) => Observable<AuditResponse> = (id: number) => this.dashboardCollection.getHistoryById(id).pipe(shareReplay(1));
    private widgetHistory$: (id: number) => Observable<AuditResponse> = (id: number) => this.widgetCollection.getHistoryById(id).pipe(shareReplay(1));

    public dashboardConfigHistory(id: number): Observable<HistoryEvent[]> {
        return this.dashboardHistory$(id).pipe(
            map(resp => {
                return this.mapToHistoryEvents(resp);
            }),
        );
    }

    public dashboardLayoutHistory(id: number): Observable<HistoryEvent[]> {
        return this.dashboardHistory$(id).pipe(
            map(resp => {
                return this.mapToHistoryEvents(resp, 'layout');
            }),
        );
    }

    // TODO now dashboard history do not triggered by widgetName changes
    public dashboardWidgetsHistory(id: number): Observable<HistoryEvent[]> {
        return this.dashboardHistory$(id).pipe(
            map(resp => {
                return this.mapWidgetsToHistoryEvents(resp);
            }),
        );
    }

    public widgetConfigHistory(id: number): Observable<HistoryEvent[]> {
        return this.widgetHistory$(id).pipe(
            map(resp => {
                return this.mapToHistoryEvents(resp);
            }),
        );
    }

    private mapToHistoryEvents(auditResp: AuditResponse, auditField: 'config' | 'layout' = 'config'): HistoryEvent[] {
        if (!auditResp) {
            return [];
        }
        const historyEvents = auditResp?.content.map(content => ({
            user: content.revInfo.lastModifiedBy,
            config: JSON.stringify(content.audit[auditField]),
            version: content.revInfo.rev,
            date: content.revInfo.revtstmp,
        })).reverse();

        return historyEvents.filter((event, index, array) => {
            return index === 0 || event.config !== array[index - 1].config;
        });
    }

    private mapWidgetsToHistoryEvents(auditResp: AuditResponse): HistoryEvent[] {
        if (!auditResp) {
            return [];
        }
        const historyEvents = auditResp?.content.map(content => ({
            user: content.revInfo.lastModifiedBy,
            config: JSON.stringify(content.audit.widgets.map(widget => {
                delete widget.config;
                return widget;
            })),
            version: content.revInfo.rev,
            date: content.revInfo.revtstmp,
        })).reverse();

        return historyEvents.filter((event, index, array) => {
            return index === 0 || event.config !== array[index - 1].config;
        });
    }
}
