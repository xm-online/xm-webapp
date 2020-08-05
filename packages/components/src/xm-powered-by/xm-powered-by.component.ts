import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmUiConfigService } from '@xm-ngx/core';

import { Principal } from '../../../../src/app/shared/auth';

export interface PoweredBy {
    text?: string;
    altText?: string;
    redirectUrl?: string;
    imageUrl?: string;
}

@Component({
    selector: 'xm-powered-by',
    template: `
        <div class="xm-powered-by">
            <div class="powered-by-text" *ngIf="config.text">
                <span class="truncate">{{config.text | translate}}</span>
            </div>
            <div class="powered-by-image" *ngIf="config.imageUrl">
                <img [class.has-url]="config.redirectUrl"
                     [src]="config.imageUrl"
                     [title]="config.altText ? (config.altText | translate) : ''"
                     [alt]="config.altText ? (config.altText | translate) : ''"
                     (click)="redirect(config.redirectUrl)">
            </div>
        </div>
    `,
    styleUrls: ['./xm-powered-by.component.scss'],
})
export class XmPoweredBy implements OnInit, OnDestroy {

    public config: PoweredBy;

    constructor(
        public principal: Principal,
        private xmUiConfigService: XmUiConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.xmUiConfigService.config$().pipe(takeUntilOnDestroy(this)).subscribe((config) => {
            this.config = (config && config.poweredBy) ? config.poweredBy : null;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public redirect(url: string): void | null {
        if (!url) { return null }
        window.open(url);
    }

}


