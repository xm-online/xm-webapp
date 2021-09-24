import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import {
    XM_SIDEBAR_CONFIG,
    XmSidebarConfig,
    XmSidebarPresentationType,
    XmSidebarStoreService,
} from '@xm-ngx/components/sidebar';

@Component({
    selector: 'xm-navbar-toggle-widget',
    template: `
        <button (click)="toggleSidebar()"
                *xmIfSession
                [ngClass]="{toggled: isOpen}"
                class="navbar-toggle btn btn-icon btn-just-icon btn-link btn-no-ripple"
                mat-icon-button
                type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggle-icon icon-bar"></span>
            <span class="navbar-toggle-icon icon-bar"></span>
            <span class="navbar-toggle-icon icon-bar"></span>
        </button>
    `,
    styleUrls: ['./xm-navbar-toggle-widget.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarToggleWidget implements OnInit, OnDestroy {
    public isOpen: boolean = false;
    private closePresentationType: XmSidebarPresentationType;

    constructor(
        private xmSidebarStoreService: XmSidebarStoreService,
        @Inject(XM_SIDEBAR_CONFIG) config: XmSidebarConfig,
    ) {
        this.closePresentationType = config.defaultCloseType;
    }

    public ngOnInit(): void {
        this.xmSidebarStoreService.onStateChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(i => this.isOpen =
                i === XmSidebarPresentationType.Open
                || i === XmSidebarPresentationType.Tablet,
            );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public toggleSidebar(): void {
        if (this.xmSidebarStoreService.state.presentationType === XmSidebarPresentationType.Open) {
            this.xmSidebarStoreService.setPresentationType(this.closePresentationType);
        } else {
            this.xmSidebarStoreService.setPresentationType(XmSidebarPresentationType.Open);
        }
    }
}
