import { inject, Injectable } from '@angular/core';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { QueryParams, TransferEnv } from '../types';
import { Observable, Subject } from 'rxjs';
import { DashboardsTransferApiService } from './dashboards-transfer-api.service';
import { tap } from 'rxjs/operators';

type DashboardTypeKey = string;
type DashboardTargetId = number;

@Injectable()
export class TargetDashboardsService {
    private readonly api = inject(DashboardsTransferApiService);

    public targetDashboards: DashboardWithWidgets[] = [];
    public existedTargetDashboardsMap: Map<DashboardTypeKey, DashboardTargetId> = new Map();
    public identifyDashboards$$: Subject<boolean> = new Subject();

    public getTargetDashboards(queryParams: QueryParams = {}, targetEnvironment: TransferEnv): Observable<DashboardWithWidgets[]> {
        this.targetDashboards = [];

        return this.api.getDashboards(queryParams, targetEnvironment).pipe(
            tap(dashboards => {
                this.targetDashboards = dashboards;
            }),
        );
    }

    public identifyExistedDashboard(dashboards: DashboardWithWidgets[]): void {
        if (!this.targetDashboards.length) return;

        dashboards.forEach(({ typeKey }) => {
            if (this.existedTargetDashboardsMap.has(typeKey)) return;

            const targetIndex: number = this.targetDashboards.findIndex(dashboard => dashboard.typeKey === typeKey);

            if (targetIndex === -1) return;

            const targetDashboardId: number = this.targetDashboards[targetIndex].id;
            this.existedTargetDashboardsMap.set(typeKey, targetDashboardId);
        });

        this.identifyDashboards$$.next(true);
    }

    public isDashboardExists(typeKey: string): boolean {
        return this.existedTargetDashboardsMap.has(typeKey);
    }

    public getDashboardTargetId(typeKey: string): number {
        return this.existedTargetDashboardsMap.get(typeKey);
    }

    public clearTargetDashboards(): void {
        this.targetDashboards = [];
        this.existedTargetDashboardsMap.clear();
    }
}
