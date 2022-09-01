import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { LinksGroupWidgetConfig } from './links-group-widget';


@Component({
    selector: 'xm-links-group-button-widget',
    template: `
        <div *ngIf="config?.list" class="mb-3">
            <nav class="xm-button-group p-3 bg-surface"
                 role="group">
                <ng-container *ngFor="let item of config.list">
                    <a [routerLink]="item.routerLink"
                       *xmPermission="item.privileges"
                       routerLinkActive="active"
                       #rla="routerLinkActive"
                       [attr.data-qa]="item.dataQa || 'link-button'"
                       mat-button [ngClass]="rla.isActive ? 'mat-flat-button' : 'mat-stroked-button'"
                       color="primary"
                       class="me-3"
                       type="button">
                        {{item.title | translate}}
                    </a>
                </ng-container>
            </nav>
        </div>
    `,
})
export class LinksGroupButtonWidget {
    @Input()
    public config: LinksGroupWidgetConfig;
}

@NgModule({
    declarations: [LinksGroupButtonWidget],
    exports: [LinksGroupButtonWidget],
    imports: [
        CommonModule,
        RouterModule,
        XmPermissionModule,
        XmTranslationModule,
        MatButtonModule,
    ]
})
export class LinksGroupButtonWidgetModule {
    public entry: Type<XmDynamicWidget> = LinksGroupButtonWidget;
}
