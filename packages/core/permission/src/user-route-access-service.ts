import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    UrlSegment,
} from '@angular/router';

import { Principal } from '@xm-ngx/core/user';
import { StateStorageService } from '@xm-ngx/core/auth';
import { PermissionGuardData } from './permission.guard';

@Injectable()
export class UserRouteAccessService implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private router: Router,
        private principal: Principal,
        private stateStorageService: StateStorageService,
    ) {
    }

    public canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.canActivateFunc(route.data as PermissionGuardData);
    }

    public canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.canActivateFunc(route.data as PermissionGuardData);
    }

    public canLoad(route: Route, _segments: UrlSegment[]): Promise<boolean> {
        return this.canActivateFunc(route.data as PermissionGuardData);
    }

    private canActivateFunc(data: PermissionGuardData): Promise<boolean> {
        const privileges = data.privileges || { value: [] };
        if (!(privileges.value && privileges.value.length)) {
            return Promise.resolve(true);
        }
        return this.checkLogin(privileges);
    }

    private checkLogin(privileges: any = {}): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {
            if (account && privileges.value && privileges.value.length) {
                return principal.hasPrivileges(privileges.value, privileges.condition)
                    .then((result) => {
                        if (result instanceof Array) {
                            if (result.length) {
                                console.warn('error.privilegeInsufficient', { name: result.join(', ') });
                            }
                            return !result.length;
                        }
                        return result;
                    });
            }

            this.stateStorageService.storeUrl(window.location.href.substring(window.location.origin.length));
            this.router.navigate(['/']);
            return false;
        }));
    }
}
