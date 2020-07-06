import { Injectable } from '@angular/core';
import { XmUser } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleService } from '../../../../src/app/shared/role/role.service';
import { XmUserPermission } from './xm-user-model';

export const SUPER_ADMIN = 'SUPER-ADMIN';

@Injectable({ providedIn: 'root' })
export class XmSuperAdminService {

    constructor(private roleService: RoleService) {
    }

    public isSuperAdmin(user: XmUser): boolean {
        return SUPER_ADMIN === user.roleKey;
    }

    /**
     * Workaround
     * to apply all permissions to the Super User
     */
    public modifyUser<T extends XmUser>(user: T): Observable<T> {
        return this.getAllPermissions().pipe(
            map((permissions) => {
                permissions.forEach(i => i.enabled = true);
                user.permissions = permissions;
                return user;
            }),
        );
    }

    private getAllPermissions(): Observable<XmUserPermission[]> {
        return this.roleService.getMatrix().pipe(map((i) => i.permissions));
    }

}
