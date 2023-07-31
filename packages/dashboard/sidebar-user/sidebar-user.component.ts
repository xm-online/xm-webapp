import { Component } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import * as _ from 'lodash';
import { MenuItem } from '@xm-ngx/dashboard/menu';
import { UserWidgetBase } from './user-widget.base';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmUserService } from '@xm-ngx/core/user';
import { ContextService } from '@xm-ngx/core/context';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '@xm-ngx/dashboard/menu';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { SidebarUserSubtitle } from './sidebar-user-subtitle';
import { MenuLinkComponent } from '@xm-ngx/dashboard/menu';


@Component({
    selector: 'xm-sidebar-user',
    templateUrl: './sidebar-user.component.html',
    styleUrls: ['./sidebar-user.component.scss'],
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
    imports: [
        CommonModule,
        MenuComponent,
        MenuLinkComponent,
        XmPermissionModule,
        XmTranslationModule,
        XmDynamicModule,
        SidebarUserSubtitle,
    ],
    standalone: true,
})
export class SidebarUserComponent extends UserWidgetBase {

    public active: boolean = false;

    constructor(
        protected readonly dashboardService: DashboardStore,
        protected readonly userService: XmUserService,
        protected readonly contextService: ContextService,
        protected readonly router: Router,
    ) {
        super(dashboardService, userService, contextService, router);
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
}

