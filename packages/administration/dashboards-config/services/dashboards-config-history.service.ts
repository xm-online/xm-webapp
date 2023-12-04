import { inject, Injectable } from '@angular/core';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { map, Observable, of } from 'rxjs';
import { AuditResponse, HistoryEvent } from '../configuration-history/models/config-history.model';
import { catchError, shareReplay } from 'rxjs/operators';
import { XmToasterService } from '@xm-ngx/toaster';

@Injectable()
export class DashboardsConfigHistoryService {
    private dashboardCollection: DashboardCollection = inject<DashboardCollection>(DashboardCollection);
    private widgetCollection: WidgetCollection = inject<WidgetCollection>(WidgetCollection);
    private toastrService: XmToasterService = inject<XmToasterService>(XmToasterService);

    private dashboardHistory$: (id: number) => Observable<AuditResponse> = (id: number) =>
        this.dashboardCollection.getHistoryById(id).pipe(
            shareReplay(1),
            catchError(err => this.handleGettingHistoryError(err)),
        );
    private widgetHistory$: (id: number) => Observable<AuditResponse> = (id: number) =>
        this.widgetCollection.getHistoryById(id).pipe(
            shareReplay(1),
            catchError(err => this.handleGettingHistoryError(err)),
        );

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
        if (!auditResp || auditResp.empty) {
            return [];
        }
        const historyEvents = auditResp?.content
            .map(content => ({
                user: content.revInfo.lastModifiedBy,
                config: JSON.stringify(content.audit[auditField]),
                version: content.revInfo.rev,
                date: content.revInfo.revtstmp,
            }))
            .reverse();

        return historyEvents.filter((event, index, array) => {
            return index === 0 || event.config !== array[index - 1].config;
        });
    }

    private mapWidgetsToHistoryEvents(auditResp: AuditResponse): HistoryEvent[] {
        if (!auditResp || auditResp.empty) {
            return [];
        }
        const historyEvents = auditResp?.content
            .map(content => ({
                user: content.revInfo.lastModifiedBy,
                config: JSON.stringify(
                    content.audit.widgets.map(widget => {
                        delete widget.config;
                        return widget;
                    }),
                ),
                version: content.revInfo.rev,
                date: content.revInfo.revtstmp,
            }))
            .reverse();

        return historyEvents.filter((event, index, array) => {
            return index === 0 || event.config !== array[index - 1].config;
        });
    }

    private handleGettingHistoryError(err): Observable<any> {
        this.toastrService.create({ type: 'danger', text: 'Failed to get history. Contact the administrator.' });
        return of(err);
    }
}
