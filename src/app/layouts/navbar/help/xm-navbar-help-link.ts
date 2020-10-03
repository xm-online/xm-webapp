import { Component, OnInit } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { IHelpNavLink } from '../../../account';

@Component({
    selector: 'xm-navbar-help-link',
    template: `
        <div *ngIf="helpConfig && !(isSessionActive$ | async)"
             class="xm-nav-help-link">
            <a [routerLink]="helpConfig.navLink && helpConfig.navLink.url ? helpConfig.navLink.url : 'help'">
                <span *ngIf="helpConfig.navLink && helpConfig.navLink.text">
                  {{helpConfig.navLink.text | translate}}
                </span>
                <mat-icon *ngIf="helpConfig.navLink && helpConfig.navLink.icon">{{helpConfig.navLink.icon}}</mat-icon>
            </a>
        </div>
    `,
    styleUrls: ['./xm-navbar-help-link.scss'],
})
export class XmNavbarHelpLink implements OnInit {
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    public helpConfig: {
        navLink: IHelpNavLink;
    };

    constructor(
        private xmUiConfigService: XmUiConfigService,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnInit(): void {
        this.xmUiConfigService.config$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((config) => {
            this.helpConfig = config.helpConfig || null;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
