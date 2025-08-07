import { Permission } from '@xm-ngx/core/role';

export class Account {
    constructor(
        public activated: boolean,
        public authorities: string[],
        public email: string,
        public firstName: string,
        public langKey: string,
        public lastName: string,
        public login: string,
        public imageUrl: string,
        public permissions: Permission[],
        public privileges: string[],
        public timeZoneOffset: string,
    ) {
    }
}
