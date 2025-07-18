import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, map, mergeMap, Observable, of, shareReplay, switchMap } from 'rxjs';
import { Role } from '@xm-ngx/core/role';
import { catchError, toArray } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardsTransferApiService } from './dashboards-transfer-api.service';
import { DashboardsTransferDataService } from './dashboards-transfer-data.service';
import { QueryParams, RoleError, TransferEnv } from '../types';
import { omit } from 'lodash';

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

    public getRole(roleKey: string, env?: TransferEnv): Observable<Role> {
        return this.api.getRole(roleKey, env).pipe(
            catchError(() => {
                return of(null);
            })
        );
    }

    public updateRoles(roles: Role[], env?: TransferEnv): Observable<any> {
        this.errors = [];
        this.dashboardTransferDataService.loading = true;

        return from(roles).pipe(
            mergeMap((role: Role) => {
                const getLocalRole$ = this.getRole(role.roleKey);
                const getTargetRole$ = this.getRole(role.roleKey, env);

                return forkJoin({
                    localRole: getLocalRole$,
                    targetRole: getTargetRole$,
                }).pipe(
                    switchMap(({ localRole, targetRole }) => {
                        if (targetRole) {
                            return this.api.updateRole(localRole, env).pipe(
                                catchError((err: HttpErrorResponse) => {
                                    this.addError(err, localRole);

                                    return of(null);
                                }),
                            );
                        }

                        const payload = this.prepareRoleCreationData(localRole);

                        return this.api.createRole(payload, env).pipe(
                            catchError((err: HttpErrorResponse) => {
                                this.addError(err, localRole);

                                return of(null);
                            }),
                        );
                    })
                );
            }, 10),
            toArray(),
            map(() => {
                this.dashboardTransferDataService.loading = false;
                return true;
            }),
        );
    }

    private prepareRoleCreationData(role: Role): Partial<Role> {
        return omit(role, ['createdBy', 'updatedBy', 'createdDate', 'updatedDate']);
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
