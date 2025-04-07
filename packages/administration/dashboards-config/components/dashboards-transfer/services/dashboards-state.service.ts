import { inject, Injectable } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { clearDashboardIds, createWidgetDictionary, mapDashboardWidgets } from '../utils';
import { DashboardsTransferApiService } from './dashboards-transfer-api.service';
import { DashboardsTransferDataService } from './dashboards-transfer-data.service';
import { DashboardWithWidgetsPayloadType, QueryParams, TransferEnv } from '../types';

@Injectable()
export class DashboardsStateService {
    private readonly api = inject(DashboardsTransferApiService);
    private readonly notify = inject(XmToasterService);
    private readonly dashboardTransferDataService = inject(DashboardsTransferDataService);

    public getDashboards(queryParams: QueryParams = {}, env?: TransferEnv): Observable<DashboardWithWidgets[]> {
        return this.api.getDashboards(queryParams, env);
    }

    public transferDashboards(url: string, token: string, dashboards: DashboardWithWidgets[]): Observable<boolean> {
        this.dashboardTransferDataService.loading = true;

        return this.getFullDashboards(dashboards).pipe(
            filter(Boolean),
            map(clearDashboardIds),
            switchMap((dashboards: DashboardWithWidgetsPayloadType[]) => {
                return this.api.createDashboards(dashboards, { url, token }).pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.handleError(err);

                        return of(false);
                    }),
                );
            }),
            filter((response => typeof response !== 'boolean')),
            map(() => {
                this.dashboardTransferDataService.loading = false;
                return true;
            }),
        );
    }

    public getFullDashboards(dashboards: DashboardWithWidgets[]): Observable<DashboardWithWidgets[]> {
        return this.api.getWidgets().pipe(
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
}
