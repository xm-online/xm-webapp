import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { IWidget } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
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
        <div *ngIf="config?.list" class="mb-3">
            <nav [backgroundColor]="'accent'"
                 mat-tab-nav-bar
                 class="rounded"
                 role="group">
                <ng-container *ngFor="let item of config.list">
                    <a [routerLink]="item.routerLink"
                       *xmPermission="item.privileges"
                       routerLinkActive="active"
                       mat-tab-link
                       #rla="routerLinkActive"
                       [active]="rla.isActive"
                       type="button">
                        {{item.title | translate}}
                    </a>
                </ng-container>
            </nav>
        </div>
    `,
    styleUrls: ['./links-group-widget.component.scss'],
})
export class LinksGroupWidgetComponent implements OnInit, OnDestroy {
    @Input()
    public config: Config;

    public isMobile: boolean = false;

    constructor(private breakpointObserver: BreakpointObserver) {
    }

    public ngOnInit(): void {
        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ]).pipe(takeUntilOnDestroy(this)).subscribe((state: BreakpointState) => {
            this.isMobile = state.breakpoints[Breakpoints.XSmall]
                || state.breakpoints[Breakpoints.Small];
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}

@NgModule({
    declarations: [LinksGroupWidgetComponent],
    entryComponents: [LinksGroupWidgetComponent],
    exports: [LinksGroupWidgetComponent],
    imports: [
        CommonModule,
        RouterModule,
        XmPermissionModule,
        XmTranslationModule,
        MatButtonModule,
        MatTabsModule,
    ],
})
export class LinksGroupWidgetModule {
    public entry: Type<IWidget> = LinksGroupWidgetComponent;
}
