import { Component, Input } from '@angular/core';
import { XmUser } from '@xm-ngx/core/user';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { get } from 'lodash';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicModule } from '@xm-ngx/dynamic';

export interface SidebarUserSubtitleOptions {
    selector: string,
    class: string,
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
                             [class]="options?.options?.class"
                             [value]="get(value, options.field)"
                             [options]="options.options"></ng-template>
            </ng-template>
            <ng-template #defaultView>
                <span class="sidebar-user-subtitle-label">{{options.label | translate}}</span>
                <span class="sidebar-user-subtitle-value">{{get(value, options.field)}}</span>
            </ng-template>
        </ng-container>
    `,
    imports: [
        CommonModule,
        XmPermissionModule,
        XmTranslationModule,
        XmDynamicModule,
    ],
    standalone: true,
})
export class SidebarUserSubtitle {

    @Input() public options: SidebarUserSubtitleOptions;
    @Input() public value: XmUser;

    public get(user: XmUser, field: string): string {
        return get(user, field);
    }
}
