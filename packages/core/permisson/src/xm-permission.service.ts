import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { XmUser, XmUserPermission, XmUserService } from '@xm-ngx/core/user';

export const SUPER_ADMIN = 'SUPER-ADMIN';

function getPrivileges(permissions: XmUserPermission[]): string[] {
    return _.reduce(permissions, (result, el) => {
        if (el.enabled) {
            result.push(el.privilegeKey);
        }
        return result;
    }, []);
}

export enum PermissionCheckStrategy {
    ALL = 'all',
    ANY = 'any'
}

@Injectable({
    providedIn: 'root',
})
export class XmPermissionService {

    constructor(protected userService: XmUserService) {
    }

    public permissions$(): Observable<XmUserPermission[]> {
        return this.userService.user$().pipe(
            map((u) => u || { permissions: [] }),
            map((u: XmUser) => u.permissions),
        );
    }

    public privileges$(): Observable<string[]> {
        return this.permissions$().pipe(map(getPrivileges));
    }

    public hasPrivilege(privilege: string): Observable<boolean> {
        if (!privilege) {
            throw new Error('The privilege is empty!');
        }
        return this.privileges$().pipe(
            map((arr) => _.includes(arr, privilege)),
            this.isSuperAdmin.bind(this),
        );
    }

    public hasPrivileges(privileges: string[]): Observable<boolean> {
        if (!privileges && !privileges.length) {
            throw new Error('The privileges array is empty!');
        }
        return this.privileges$().pipe(
            map((arr) => _.intersection(arr, privileges).length === privileges.length),
            this.isSuperAdmin.bind(this),
        );
    }

    public hasAnyPrivilege(privileges: string[]): Observable<boolean> {
        if (!privileges && !privileges.length) {
            throw new Error('The privileges array is empty!');
        }
        return this.privileges$().pipe(
            map((arr) => _.intersection(arr, privileges).length !== 0),
            this.isSuperAdmin.bind(this),
        );
    }

    public hasPrivilegesBy(
        privileges: string[],
        strategy: PermissionCheckStrategy = PermissionCheckStrategy.ALL,
    ): Observable<boolean> {
        switch (strategy) {
            case PermissionCheckStrategy.ALL:
                return this.hasPrivileges(privileges);
            case PermissionCheckStrategy.ANY:
                return this.hasAnyPrivilege(privileges);
            default:
                return this.hasPrivileges(privileges);
        }
    }

    private isSuperAdmin(res: Observable<boolean>): Observable<boolean> {
        return this.userService.user$().pipe(
            filter((u) => Boolean(u)),
            first(),
            switchMap((user) => user.roleKey === SUPER_ADMIN ? of(true) : res),
        );
    }
}
