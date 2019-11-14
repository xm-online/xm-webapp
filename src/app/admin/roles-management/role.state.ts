import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Role } from '../../shared/role/role.model';
import { GetRolesByPage, PopulateRoles } from './role.actions';

export class RoleStateModel {
    roles: Role[];
    rolesPaged: Role[];
}

@State<RoleStateModel>({
    name: 'roles',
    defaults: {
        roles: [],
        rolesPaged: [],
    },
})

export class RoleState {
    @Selector()
    static getRoles(state: RoleStateModel) {
        return state.roles;
    }

    @Action(PopulateRoles)
    populateRoles({getState, patchState}: StateContext<RoleStateModel>, { payload }: PopulateRoles) {
        patchState({
            roles: payload,
        });
    }

    @Action(GetRolesByPage)
    getRolesByPage({getState, patchState }: StateContext<RoleStateModel>, { payload }: GetRolesByPage) {
        const startPos = (payload - 1) * 10;
        const endPos = startPos + 10;
        patchState({
            rolesPaged: getState().roles.slice(startPos, endPos),
        });
    }
}
