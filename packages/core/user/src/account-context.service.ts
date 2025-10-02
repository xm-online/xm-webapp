import { Injectable } from '@angular/core';
import _ from 'lodash';
import { XmUserService } from './xm-user.service';
import { SUPER_ADMIN } from '@xm-ngx/core/auth';

@Injectable({ providedIn: 'root' })
export class AccountContextService {
    private context: any = {};
    private isSuperAdmin: boolean;

    constructor(
        public userService: XmUserService
    ) {
        this.userService.user$().subscribe((user) => {
            this.context = user.context;
            this.isSuperAdmin = user.roleKey === SUPER_ADMIN;
        });
    }

    public hasContextKey(key: string): boolean {
        return _.has(this.context, key);
    }

    public contextValue(key: string): boolean {
        return _.get(this.context, key);
    }

    public hasContextPermission(path: string, key: string): boolean {
        const permissions = _.get(this.context, `${path}.permissions`);
        return this.isSuperAdmin || !!_.includes(permissions, key);
    }

}
