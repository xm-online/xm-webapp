import { MenuItem } from '@xm-ngx/components/menu';
import { combineLatest, Observable } from 'rxjs';
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SidebarUserSubtitleOptions } from './sidebar-user-subtitle';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import { ContextService } from '@xm-ngx/core/context';
import { ActivationEnd, Router } from '@angular/router';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
    flatTree,
    filterByConditionDashboards } from '@xm-ngx/components/menu';
import { buildMenuTree } from '@xm-ngx/components/menu';
import * as _ from 'lodash';

interface UserOptions {
    roleKey: string;
    username: string;
    avatarUrl: string;
    user: XmUser;
}

const USER_MENU: MenuItem[] = [
    {
        path: 'settings',
        position: 1,
        permission: 'ACCOUNT.GET_LIST.ITEM',
        url: ['settings'],
        icon: 'settings',
        title: 'global.menu.account.settings',
        children: [],
        parent: null,
    },
    {
        path: 'password',
        position: 2,
        permission: 'ACCOUNT.PASSWORD.UPDATE',
        url: ['password'],
        icon: 'lock',
        title: 'global.menu.account.password',
        children: [],
        parent: null,
    },
];

const LOGOUT_CONTROL: MenuItem = {
    path: 'logout',
    position: 3,
    url: ['logout'],
    icon: 'logout',
    title: 'global.menu.account.logout',
    children: [],
    parent: null,
};

const DEFAULT: UserOptions = {
    username: '',
    roleKey: '',
    avatarUrl: './assets/img/anonymous.png',
    user: null,
};

function getUserName(user: XmUser): string {
    if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`;
    }
    return user.logins[0].login;

}

function userToOptions(user: XmUser): UserOptions {
    if (!user){
        return null;
    }
    const opts: UserOptions = {
        user: user,
        roleKey: user.roleKey,
        username: getUserName(user),
        avatarUrl: user.imageUrl || undefined,
    };

    return _.defaults(opts, DEFAULT);
}

@Directive()
export class UserWidgetBase implements OnInit, OnDestroy {
    public logoutControl: MenuItem = LOGOUT_CONTROL;
    public user: UserOptions;
    public menu$: Observable<MenuItem[]>;

    @Input() public config: {
        subtitles: SidebarUserSubtitleOptions[]
    };

    constructor(
        protected readonly dashboardService: DashboardStore,
        protected readonly userService: XmUserService,
        protected readonly contextService: ContextService,
        protected readonly router: Router,
    ) {
    }

    public ngOnInit(): void {
        this.menu$ = this.dashboardService.dashboards$().pipe(
            takeUntilOnDestroy(this),
            filter((dashboards) => Boolean(dashboards)),
            map((i) => filterByConditionDashboards(i, this.contextService)),
            map((i) => _.filter(i, (j) => (j.config?.menu?.section === 'xm-user'))),
            map(dashboards => buildMenuTree(dashboards)),
            map(tree => flatTree(tree)),
            map((arr) => arr?.length ? arr : USER_MENU),
            shareReplay(1),
        );

        const user$ = this.userService.user$().pipe(
            takeUntilOnDestroy(this),
            map(userToOptions),
            tap((user) => this.user = user),
        );

        combineLatest([
            user$,
            this.router.events.pipe(filter((e) => e instanceof ActivationEnd)),
        ]).pipe(
            map((i) => i[0]),
            switchMap(() => this.menu$),
            takeUntilOnDestroy(this),
        ).subscribe((menu) => this.selectActive(menu));
    }

    public selectActive(menu: MenuItem[]): void {
        _.forEach(menu, (menu) => {
            if (this.router.isActive(menu.url.join('/'), false)) {
                return false;
            }
            return true;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
