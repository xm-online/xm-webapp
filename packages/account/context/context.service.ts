import { Injectable } from '@angular/core';
import { XmUserService } from "@xm-ngx/core/user";
import _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class AccountContextService {
    private context: any = {};

    constructor(
        public userService: XmUserService
    ) {
        this.userService.user$().subscribe((user) => {
            this.context = user.context;
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
        return !!_.find(permissions, key);
    }

}
