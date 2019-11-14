import { Role } from '../../shared/role/role.model';

export class PopulateRoles {
    static readonly type: any = '[ROLE] Populate';

    constructor(public payload: Role[]) {}
}

export class GetRolesByPage {
    static readonly type: any = '[ROLE] Get by page';

    constructor(public payload: number) {}
}
