import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Role } from '../../shared/role/role.model';
import { AddRole, GetRolesByPage, PopulateRoles, RemoveRole } from './role.actions';

export class RoleStateModel {
    roles: Role[];
}

@State<RoleStateModel>({
    name: 'roles',
    defaults: {
        roles: [],
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

    @Action(AddRole)
    add({getState, patchState}: StateContext<RoleStateModel>, { payload }: AddRole) {
        const state = getState();
        patchState({
            roles: [...state.roles, payload],
        });
    }

    @Action(RemoveRole)
    remove({getState, patchState }: StateContext<RoleStateModel>, { payload }: RemoveRole) {
        patchState({
            roles: getState().roles.filter(r => r.roleKey != payload),
        });
    }

    @Action(GetRolesByPage)
    getRolesByPage({getState, patchState }: StateContext<RoleStateModel>, { payload }: GetRolesByPage) {
        const startPos = (payload - 1) * 10;
        const endPos = startPos + 10;
        patchState({
            roles: getState().roles.slice(startPos, endPos),
        });
    }
}
