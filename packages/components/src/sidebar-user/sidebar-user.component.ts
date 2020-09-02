import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ActivationEnd, Router } from '@angular/router';
import {
    categoriesToMenuItems,
    dashboardsToCategories,
    filterByConditionDashboards,
} from '@xm-ngx/components/menu/menu.component';
import { SidebarUserSubtitleOptions } from '@xm-ngx/components/sidebar-user/sidebar-user-subtitle';
import { XmUser, XmUserService } from '@xm-ngx/core';
import { DashboardWrapperService } from '@xm-ngx/dashboard';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ContextService } from '../../../../src/app/shared';
import { MenuItem } from '../menu/menu-models';

interface UserOptions {
    roleKey: string;
    username: string;
    avatarUrl: string;
    user: XmUser;
}

const USER_MENU: MenuItem[] = [
    {
        position: 1,
        permission: 'ACCOUNT.GET_LIST.ITEM',
        url: ['settings'],
        icon: 'settings',
        title: 'global.menu.account.settings',
    },
    {
        position: 2,
        permission: 'ACCOUNT.PASSWORD.UPDATE',
        url: ['password'],
        icon: 'lock',
        title: 'global.menu.account.password',
    },
];

const LOGOUT_CONTROL: MenuItem = {
    position: 3,
    url: ['logout'],
    icon: 'logout',
    title: 'global.menu.account.logout',
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
    } else {
        return user.logins[0].login;
    }
}

function userToOptions(user: XmUser): UserOptions {
    const opts: UserOptions = {
        user: user,
        roleKey: user.roleKey,
        username: getUserName(user),
        avatarUrl: user.imageUrl || undefined,
    };

    return _.defaults(opts, DEFAULT);
}

@Component({
    selector: 'xm-sidebar-user',
    templateUrl: './sidebar-user.component.html',
    styleUrls: ['./sidebar-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
})
export class SidebarUserComponent implements OnInit {
    public logoutControl: MenuItem = LOGOUT_CONTROL;
    public user: UserOptions;
    public menu$: Observable<MenuItem[]>;
    public active: boolean = false;

    @Input() public config: {
        subtitles: SidebarUserSubtitleOptions[]
    };

    constructor(
        protected readonly dashboardService: DashboardWrapperService,
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
            map(dashboardsToCategories),
            map(categoriesToMenuItems),
            map((arr) => arr?.length ? arr : USER_MENU),
            shareReplay(1),
        );

        const user$ = this.userService.user$().pipe(
            takeUntilOnDestroy(this),
            filter((u) => !!u),
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

    public getState(): string {
        return this.active ? 'expanded' : 'collapsed';
    }

    public toggle(): void {
        this.active = !this.active;
    }

    public selectActive(menu: MenuItem[]): void {
        _.forEach(menu, (menu) => {
            if (this.router.isActive(menu.url.join('/'), false)) {
                this.active = true;
                return false;
            }
            return true;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}

