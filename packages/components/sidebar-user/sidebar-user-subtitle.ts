import { Component, Input } from '@angular/core';
import { XmUser } from '@xm-ngx/core/user';
import { Translate } from '@xm-ngx/translation';
import { get } from 'lodash';

export interface SidebarUserSubtitleOptions {
    selector: string,
    options: unknown,
    label: Translate,
    role: string,
    field: string,
}

@Component({
    selector: 'sidebar-user-subtitle',
    template: `
        <ng-container *ngIf="!options?.role || (options?.role === value.roleKey)">
            <ng-template [ngIf]="options.selector" [ngIfElse]="defaultView">
                <ng-template xmDynamicPresentation
                             [selector]="options.selector"
                             [value]="get(value, options.field)"
                             [options]="options.options"></ng-template>
            </ng-template>
            <ng-template #defaultView>
                <span class="sidebar-user-subtitle-label">{{options.label | translate}}</span>
                <span class="sidebar-user-subtitle-value">{{get(value, options.field)}}</span>
            </ng-template>
        </ng-container>
    `,
})

export class SidebarUserSubtitle {

    @Input() public options: SidebarUserSubtitleOptions;
    @Input() public value: XmUser;

    public get(user: XmUser, field: string): string {
        return get(user, field);
    }
}
