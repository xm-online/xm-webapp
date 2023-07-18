import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Routes } from '@angular/router';
import { UserMgmtDetailComponent } from '@xm-ngx/administration/user-management-detail';
import { UserMgmtComponent } from '@xm-ngx/administration/user-management';
import { TABLE_CONFIG_DEFAULT } from '@xm-ngx/components/table';
import { JhiPaginationUtil } from 'ng-jhipster';

import { Principal } from '@xm-ngx/core/user';

@Injectable()
export class UserResolve implements CanActivate {

    constructor(private principal: Principal) {
    }

    public canActivate(): Promise<boolean> {
        return this.principal.identity().then(() => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

@Injectable()
export class UserResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {
    }

    // TODO: code duplication of ApplicationResolvePagingParams
    public resolve(route: ActivatedRouteSnapshot):
        { predicate: string; size: number; page: number; ascending: boolean } {
        const page = route.queryParams.page ? route.queryParams.page : '1';
        const sort = route.queryParams.sort ? route.queryParams.sort : 'id,asc';
        const size = route.queryParams.size && parseInt(route.queryParams.size, 10) || TABLE_CONFIG_DEFAULT.pageSize;
        return {
            size,
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort),
        };
    }
}

export const userMgmtRoute: Routes = [
    {
        path: 'user-management',
        component: UserMgmtComponent,
        resolve: {
            pagingParams: UserResolvePagingParams,
        },
        data: {
            privileges: { value: ['USER.GET_LIST'] },
            pageTitle: 'global.menu.admin.main',
            pageSubTitleTrans: 'global.menu.admin.userManagement',
        },
    },
    {
        path: 'user-management/:userKey',
        component: UserMgmtDetailComponent,
        data: {
            privileges: { value: ['USER.GET_LIST'] },
            pageTitle: 'global.menu.admin.main',
            pageSubTitleTrans: 'userManagement.detail.title',
        },
    },
];
