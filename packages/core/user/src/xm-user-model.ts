import { Id } from '@xm-ngx/interfaces';

export interface XmUserLogin {
    id?: Id;
    typeKey?: string;
    stateKey?: string;
    login?: string;
    removed?: boolean;
}

export interface XmUserPermission {
    msName?: string;
    roleKey?: string;
    privilegeKey?: string;
    enabled?: boolean;
    reactionStrategy?: string;
    envCondition?: string;
    resourceCondition?: string;
    resources?: string[];
    description?: string;
}


export interface XmUser<D = any> {
    id?: Id;
    userKey?: string;
    logins?: XmUserLogin[];
    firstName?: string;
    lastName?: string;
    activated?: boolean;
    autoLogoutEnabled?: boolean;
    autoLogoutTime?: number;
    timeZoneOffset?: string;
    autoLogoutTimeoutSeconds?: number;
    langKey?: string;
    permissions?: XmUserPermission[];
    roleKey?: string;
    authorities?: string[];
    createdBy?: string;
    createdDate?: Date | string;
    lastModifiedBy?: string;
    lastModifiedDate?: Date | string;
    password?: string;
    tfaEnabled?: boolean;
    imageUrl?: string;
    data?: D;
}
