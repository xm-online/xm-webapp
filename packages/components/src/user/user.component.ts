import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit, Type } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { ActivationEnd, Router } from '@angular/router';
import { XmMenuModule } from '@xm-ngx/components/menu';
import {
    categoriesToMenuItems,
    dashboardsToCategories,
    filterByConditionDashboards,
} from '@xm-ngx/components/menu/menu.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { DashboardService } from '@xm-ngx/dashboard';
import * as _ from 'lodash';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, share, switchMap } from 'rxjs/operators';
import { AccountService, ContextService, User } from '../../../../src/app/shared';
import { MenuItem } from '../menu/menu-models';

interface UserOptions {
    username: string;
    avatarUrl: string;
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
    avatarUrl: './assets/img/anonymous.png',
};

function getUserName(user: User): string {
    if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`;
    } else {
        return user.logins[0].login;
    }
}

function userToOptions(user: User): UserOptions {
    const opts: UserOptions = {
        username: getUserName(user),
        avatarUrl: user.imageUrl || undefined,
    };

    return _.defaults(opts, DEFAULT);
}

@Component({
    selector: 'xm-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
})
export class UserComponent implements OnInit {
    public logoutControl: MenuItem = LOGOUT_CONTROL;
    public user$: Observable<UserOptions>;
    public menu$: Observable<MenuItem[]>;
    public active: boolean = false;
    protected subscriptions: Subscription[] = [];

    constructor(
        protected readonly dashboardService: DashboardService,
        protected readonly accountService: AccountService,
        protected readonly contextService: ContextService,
        protected readonly router: Router,
    ) {
    }

    public ngOnInit(): void {
        this.menu$ = this.dashboardService.query().pipe(
            map((i) => i.body),
            map((i) => filterByConditionDashboards(i, this.contextService)),
            map((i) => _.filter(i, (j) => (j.config?.menu?.section === 'xm-user'))),
            map(dashboardsToCategories),
            map(categoriesToMenuItems),
            map((arr) => arr?.length ? arr : USER_MENU),
            share(),
        );

        this.user$ = this.accountService.get().pipe(
            map((i) => i.body),
            map(userToOptions),
            share(),
        );

        this.subscriptions.push(combineLatest([
            this.user$,
            this.router.events.pipe(filter((e) => e instanceof ActivationEnd)),
        ]).pipe(
            map((i) => i[0]),
            switchMap(() => this.menu$),
        ).subscribe((menu) => this.selectActive(menu)));
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
        this.subscriptions.forEach((i) => i.unsubscribe());
    }
}

@NgModule({
    imports: [
        CommonModule,
        XmMenuModule,
        XmPermissionModule,
    ],
    exports: [UserComponent],
    declarations: [UserComponent],
    providers: [],
})
export class XmUserModule {
    public entry: Type<UserComponent> = UserComponent;
}
