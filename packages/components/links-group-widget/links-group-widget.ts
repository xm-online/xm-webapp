import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { IfDashboardSlugModule } from '@xm-ngx/components/if-dashboard-slug';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';


export interface LinksGroupWidgetConfigItem extends DataQa {
    permittedByDashboardSlug: string;
    privileges: string | string[];
    title: Translate;
    routerLink: string[] | string;
}

export interface LinksGroupWidgetConfig {
    list: LinksGroupWidgetConfigItem[];
}

@Component({
    selector: 'xm-links-group-widget',
    standalone: true,
    imports:[
        CommonModule,
        RouterModule,
        XmPermissionModule,
        XmTranslationModule,
        MatButtonModule,
        MatTabsModule,
        IfDashboardSlugModule,
    ],
    styleUrls:['./links-group-widget.scss'],
    template: `
        <div *ngIf="config?.list" class="bg-surface mb-3 overflow-hidden">
            <nav [color]="'primary'"
                 mat-tab-nav-bar
                 [tabPanel]="tabPanel"
                 mat-stretch-tabs="false"
                 mat-align-tabs="start"
                 role="group">
                <ng-container *ngFor="let item of config.list">
                    <ng-container *xmIfDashboardSlug="item.permittedByDashboardSlug">
                        <a [routerLink]="item.routerLink"
                           *xmPermission="item.privileges"
                           routerLinkActive="active"
                           [attr.data-qa]="item.dataQa || 'link-button'"
                           mat-tab-link
                           #rla="routerLinkActive"
                           [active]="rla.isActive"
                           [ngClass]="{'text-primary':rla.isActive}"
                           type="button">
                            {{item.title | translate}}
                        </a>
                    </ng-container>
                </ng-container>
            </nav>
            <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
        </div>
    `,
})
export class LinksGroupWidget implements XmDynamicWidget {
    @Input()
    public config: LinksGroupWidgetConfig;
}
