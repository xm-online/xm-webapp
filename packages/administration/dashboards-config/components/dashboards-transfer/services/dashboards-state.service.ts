import { inject, Injectable } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { filter, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { DashboardWidget, DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { clearDashboardIds, createWidgetDictionary, mapDashboardWidgets } from '../utils';
import { DashboardsTransferApiService } from './dashboards-transfer-api.service';
import { DashboardsTransferDataService } from './dashboards-transfer-data.service';
import { DashboardWithWidgetsPayloadType, QueryParams, TransferEnv } from '../types';
import { TargetDashboardsService } from './target-dashboards.service';

@Injectable()
export class DashboardsStateService {
    private readonly api = inject(DashboardsTransferApiService);
    private readonly notify = inject(XmToasterService);
    private readonly dashboardTransferDataService = inject(DashboardsTransferDataService);
    private readonly targetDashboardsService = inject(TargetDashboardsService);

    public getDashboards(queryParams: QueryParams = {}, env?: TransferEnv): Observable<DashboardWithWidgets[]> {
        return this.api.getDashboards(queryParams, env);
    }

    public transferDashboards(url: string, token: string, dashboards: DashboardWithWidgets[]): Observable<boolean> {
        this.dashboardTransferDataService.loading = true;

        return this.getFullDashboards(dashboards).pipe(
            filter(Boolean),
            map(clearDashboardIds),
            map(this.splitEntitiesByActionMethod),
            switchMap((data: [DashboardWithWidgetsPayloadType[], DashboardWithWidgetsPayloadType[]]) => this.createOrUpdateDashboards(data, url, token)),
            filter((response => typeof response !== 'boolean')),
            map(() => {
                this.dashboardTransferDataService.loading = false;
                return true;
            }),
        );
    }

    public getFullDashboards(dashboards: DashboardWithWidgets[], env?: TransferEnv): Observable<DashboardWithWidgets[]> {
        return this.api.getWidgets({}, env).pipe(
            map(createWidgetDictionary),
            map(mapDashboardWidgets(dashboards)),
            catchError((err: HttpErrorResponse) => {
                this.handleError(err);

                return of(null);
            }),
        );
    }

    private handleError(err: HttpErrorResponse): void {
        this.notify.create({ type: 'danger', msg: err.error.error, timeout: 10000 }).subscribe();
        this.dashboardTransferDataService.resetStepper();
        this.dashboardTransferDataService.loading = false;
    }

    private createOrUpdateDashboards = ([toCreate, toUpdate]: [DashboardWithWidgetsPayloadType[], DashboardWithWidgetsPayloadType[]], url: string, token: string): Observable<unknown> => {
        const createDashboards$ = toCreate && toCreate.length ? this.catchErrors(this.api.createDashboards(toCreate, { url, token })) : null;
        const updateDashboards$ = toUpdate && toUpdate.length ? this.catchErrors(this.updateDashboards(toUpdate, { url, token })) : null;

        return forkJoin([createDashboards$, updateDashboards$].filter(Boolean)).pipe(map(() => ({})));
    };

    private catchErrors(observable: Observable<unknown>): Observable<unknown> {
        return observable.pipe(
            catchError((err: HttpErrorResponse) => {
                this.handleError(err);

                return of(false);
            }),
        );
    }

    private updateDashboards(dashboards: DashboardWithWidgets[], targetEnv: TransferEnv): Observable<unknown> {
        return this.getFullDashboards(dashboards, targetEnv).pipe(
            filter(Boolean),
            map((targetDashboards: DashboardWithWidgets[]) => this.mapDashboardsWidgets(dashboards, targetDashboards)),
            switchMap(({ dashboards, widgetsToUpdate }) => {
                return this.api.updateDashboards(dashboards, targetEnv).pipe(
                    switchMap(() => {
                        return this.api.updateDashboardsWidgets(widgetsToUpdate, targetEnv).pipe(
                            catchError(() => of(null))
                        );
                    })
                );
            }),
        );
    }

    private mapDashboardsWidgets(
        dashboards: DashboardWithWidgets[],
        targetDashboards: DashboardWithWidgets[]
    ): { dashboards: DashboardWithWidgets[]; widgetsToUpdate: DashboardWidget[] } {
        const targetDashboardsMap = new Map<string, DashboardWithWidgets>(
            targetDashboards.map(d => [d.typeKey, d])
        );
        const widgetsToUpdate: DashboardWidget[] = [];

        const mappedDashboards = dashboards.map((dashboard) => {
            const targetDashboard = targetDashboardsMap.get(dashboard.typeKey);
            const targetWidgets = targetDashboard?.widgets ?? [];
            const targetWidgetMap = new Map<string, DashboardWidget>(
                targetWidgets.map(w => [w.name, w])
            );

            const mappedWidgets = dashboard.widgets.map(({ name, ...rest }) => {
                const targetWidgetId = targetWidgetMap.get(name)?.id ?? null;

                if (targetWidgetId) {
                    widgetsToUpdate.push({ ...rest, name, id: targetWidgetId, dashboard: { id: dashboard.id } });
                }

                return !targetWidgetId ? { ...rest, name } : null;
            }).filter(Boolean);

            return {
                ...dashboard,
                widgets: mappedWidgets,
            };
        });

        return {
            dashboards: mappedDashboards,
            widgetsToUpdate: widgetsToUpdate,
        };
    }

    private splitEntitiesByActionMethod = (dashboards: DashboardWithWidgetsPayloadType[]): [DashboardWithWidgetsPayloadType[], DashboardWithWidgetsPayloadType[]] => {
        const dashboardsToCreate: DashboardWithWidgetsPayloadType[] = [];
        const dashboardsToUpdate: DashboardWithWidgetsPayloadType[] = [];

        dashboards.forEach(({ typeKey, ...rest }) => {
            const targetId: number | undefined = this.targetDashboardsService.getDashboardTargetId(typeKey);

            if (targetId) {
                dashboardsToUpdate.push({
                    ...rest,
                    typeKey,
                    id: targetId
                });
            } else {
                dashboardsToCreate.push({ ...rest, typeKey });
            }
        });

        return [dashboardsToCreate, dashboardsToUpdate];
    };
}
