import { inject, Injectable } from '@angular/core';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { AuditResponse, HistoryEvent } from '../configuration-history/models/config-history.model';
import { catchError, scan, shareReplay } from 'rxjs/operators';
import { XmToasterService } from '@xm-ngx/toaster';

const HISTORY_PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class DashboardsConfigHistoryService {
    private widgetPage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private dashboardPage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private dashboardCollection: DashboardCollection = inject<DashboardCollection>(DashboardCollection);
    private widgetCollection: WidgetCollection = inject<WidgetCollection>(WidgetCollection);
    private toastrService: XmToasterService = inject<XmToasterService>(XmToasterService);

    private dashboardHistory$(id: number): Observable<AuditResponse> {
        return this.dashboardPage.pipe(
            switchMap(page => this.dashboardCollection.getHistoryById(id, { page, size: HISTORY_PAGE_SIZE })),
            scan((items, value) => this.accumulate(items, value)),
            catchError(err => this.handleGettingHistoryError(err)),
            shareReplay(1),
        );
    }

    private widgetHistory$(id: number): Observable<AuditResponse> {
        return this.widgetPage.pipe(
            switchMap(page => this.widgetCollection.getHistoryById(id, { page, size: HISTORY_PAGE_SIZE })),
            scan((items, value) => this.accumulate(items, value)),
            catchError(err => this.handleGettingHistoryError(err)),
            shareReplay(1),
        );
    }
    private accumulate(prev: AuditResponse, value: AuditResponse): AuditResponse {
        if (value.number === 0) {
            return value;
        }
        const prevContent = prev.content;
        const currentContent = value.empty ? [] : value.content;
        return { ...value, content: [...prevContent, ...currentContent] };
    }

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

    public nextDashboardPage(): void {
        const page = this.dashboardPage.getValue() + 1;
        this.dashboardPage.next(page);
    }

    public nexWidgetPage(): void {
        this.widgetPage.next(this.widgetPage.getValue() + 1);
    }

    public reset(): void {
        this.widgetPage.next(0);
        this.dashboardPage.next(0);
    }

    private mapToHistoryEvents(auditResp: AuditResponse, auditField: 'config' | 'layout' = 'config'): HistoryEvent[] {
        if (!auditResp || auditResp.empty) {
            return [];
        }
        const historyEvents: HistoryEvent[] = auditResp?.content?.map(content => ({
            user: content.revInfo.lastModifiedBy,
            config: JSON.stringify(content.audit[auditField]),
            version: content.revInfo.rev,
            date: content.revInfo.revtstmp,
            operation: content.operation,
            hasNext: !auditResp.last,
        }));

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
                operation: content.operation,
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
