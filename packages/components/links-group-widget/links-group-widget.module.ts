import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { IWidget } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

interface Config {
    list: {
        privileges: string | string[];
        title: Translate;
        routerLink: string[] | string;
    }[];
}

@Component({
    selector: 'xm-links-group-widget',
    template: `
        <div *ngIf="config?.list" class="text-center pb-3">
            <div class="btn-group"
                 role="group">
                <ng-container *ngFor="let item of config.list">
                    <a [routerLink]="item.routerLink"
                       *xmPermission="item.privileges"
                       routerLinkActive="active"
                       mat-stroked-button
                       type="button" class="btn btn-outline-secondary">
                        {{item.title | translate}}
                    </a>
                </ng-container>
            </div>
        </div>
    `,
})

export class LinksGroupWidgetComponent {
    @Input()
    public config: Config;
}

@NgModule({
    declarations: [LinksGroupWidgetComponent],
    entryComponents: [LinksGroupWidgetComponent],
    exports: [LinksGroupWidgetComponent],
    imports: [CommonModule, RouterModule, XmPermissionModule, XmTranslationModule, MatButtonModule],
})
export class LinksGroupWidgetModule {
    public entry: Type<IWidget> = LinksGroupWidgetComponent;
}
