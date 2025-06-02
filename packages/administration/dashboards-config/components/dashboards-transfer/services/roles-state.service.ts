import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, map, mergeMap, Observable, of, shareReplay, switchMap } from 'rxjs';
import { Role } from '@xm-ngx/core/role';
import { catchError, toArray } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardsTransferApiService } from './dashboards-transfer-api.service';
import { DashboardsTransferDataService } from './dashboards-transfer-data.service';
import { QueryParams, RoleError, TransferEnv } from '../types';

@Injectable()
export class RolesStateService {
    private readonly api = inject(DashboardsTransferApiService);
    private readonly dashboardTransferDataService = inject(DashboardsTransferDataService);

    private errors$$: BehaviorSubject<RoleError[]> = new BehaviorSubject<RoleError[]>([]);
    public errors$: Observable<RoleError[]> = this.errors$$.asObservable().pipe(
        shareReplay(1),
    );

    public set errors(newErrors: RoleError[]) {
        const oldErrors: RoleError[] = this.errors$$.value;
        this.errors$$.next([...oldErrors, ...newErrors]);
    }

    public getRoles(queryParams: QueryParams = {}, env?: TransferEnv): Observable<Role[]> {
        return this.api.getRoles(queryParams, env);
    }

    public updateRoles(roles: Role[], env?: TransferEnv): Observable<any> {
        this.errors = [];
        this.dashboardTransferDataService.loading = true;

        return from(roles).pipe(
            mergeMap((role: Role) => {
                return this.api.getRole(role.roleKey).pipe(
                    switchMap((role: Role) => {
                        return this.api.updateRole(role, env).pipe(
                            catchError((err: HttpErrorResponse) => {
                                this.addError(err, role);

                                return of(null);
                            }),
                        );
                    }),
                    catchError((err: HttpErrorResponse) => {
                        this.addError(err, role);

                        return of(null);
                    }),
                );
            }, 10),
            toArray(),
            map(() => {
                this.dashboardTransferDataService.loading = false;
                return true;
            }),
        );
    }

    private addError(err: HttpErrorResponse, role: Role): void {
        const error: RoleError = {
            roleKey: role.roleKey,
            errorCode: err.status,
            errorDescription: err.error.error_description as string,
        };
        this.errors = [error];
    }

    public resetErrors(): void {
        this.errors$$.next([]);
    }
}
