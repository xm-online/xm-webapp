import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, from, mergeMap, Observable, of, toArray } from 'rxjs';
import { DashboardWidget, DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { Role } from '@xm-ngx/core/role';

import { DashboardWithWidgetsPayloadType, QueryParams, RequestData, TransferEnv } from '../types';

@Injectable()
export class DashboardsTransferApiService {
    private readonly http: HttpClient = inject(HttpClient);

    private readonly DASHBOARD_URL: string = 'dashboard/api/dashboards';
    private readonly DASHBOARD_BULK_URL: string = 'dashboard/api/dashboards/bulk';
    private readonly WIDGET_URL: string = 'dashboard/api/widgets';
    private readonly ROLES_URL: string = 'uaa/api/roles';

    public getDashboards(queryParams: QueryParams = {}, env?: TransferEnv): Observable<DashboardWithWidgets[]> {
        const { host, headers } = this.getRequestData(env);

        return this.http.get<DashboardWithWidgets[]>(
            `${host}/${this.DASHBOARD_URL}`,
            {
                headers,
                params: this.generateHttpParams(queryParams),
            },
        );
    }

    public createDashboards(dashboards: DashboardWithWidgetsPayloadType[], env?: TransferEnv): Observable<any> {
        const { host, headers } = this.getRequestData(env);

        return this.http.post(`${host}/${this.DASHBOARD_BULK_URL}`, dashboards, { headers });
    }

    public updateDashboards(dashboards: DashboardWithWidgetsPayloadType[], env: TransferEnv): Observable<any> {
        const { host, headers } = this.getRequestData(env);

        return this.http.put(`${host}/${this.DASHBOARD_BULK_URL}`, dashboards, { headers });
    }

    public updateDashboardsWidgets(widgets: DashboardWidget[], env: TransferEnv): Observable<unknown> {
        const { host, headers } = this.getRequestData(env);

        return from(widgets).pipe(
            mergeMap((widget: DashboardWidget) => {
                return this.http.put(`${host}/${this.WIDGET_URL}`, widget, { headers }).pipe(
                    catchError(() => of(null))
                );
            }, 5),
            toArray()
        );
    }

    public deleteDashboardWidgets(ids: number[], env: TransferEnv): Observable<unknown> {
        const { host, headers } = this.getRequestData(env);

        return from(ids).pipe(
            mergeMap((id: number) => {
                return this.http.delete(`${host}/${this.WIDGET_URL}/${id}`, { headers }).pipe(
                    catchError(() => of(null))
                );
            }, 5),
            toArray()
        );
    }

    public getRoles(queryParams: QueryParams = {}, env?: TransferEnv): Observable<Role[]> {
        const { host, headers } = this.getRequestData(env);

        return this.http.get<Role[]>(
            `${host}/${this.ROLES_URL}`,
            {
                headers,
                params: this.generateHttpParams(queryParams),
            },
        );
    }

    public getRole(roleKey: string, env?: TransferEnv): Observable<Role> {
        const { host, headers } = this.getRequestData(env);

        return this.http.get<Role>(`${host}/${this.ROLES_URL}/${roleKey}`, { headers });
    }

    public updateRole(role: Role, env?: TransferEnv): Observable<any> {
        const { host, headers } = this.getRequestData(env);

        return this.http.put(
            `${host}/${this.ROLES_URL}`,
            role,
            { headers },
        );
    }

    public createRole(role: Role, env: TransferEnv): Observable<any> {
        const { host, headers } = this.getRequestData(env);

        return this.http.post(
            `${host}/${this.ROLES_URL}`,
            role,
            { headers },
        );
    }

    public getWidgets(queryParams: QueryParams = {}, env?: TransferEnv): Observable<DashboardWidget[]> {
        const { host, headers } = this.getRequestData(env);

        return this.http.get<DashboardWidget[]>(`${host}/${this.WIDGET_URL}`,
            {
                headers,
                params: this.generateHttpParams(queryParams),
            });
    }

    private generateHttpParams(queryParams: QueryParams): HttpParams {
        const httpParams = new HttpParams();
        Object.entries(queryParams).forEach(([key, value]) => httpParams.set(key, value));

        return httpParams;
    }

    private getRequestData(env?: TransferEnv): RequestData {
        const data: RequestData = {
            host: '',
            headers: {},
        };

        if (env) {
            data.host = env.url;
            data.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.token}`,
            };
        }

        return data;
    }
}
