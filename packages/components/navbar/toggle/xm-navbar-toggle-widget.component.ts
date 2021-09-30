import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSidebarStoreService } from '@xm-ngx/components/sidebar';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

import {
    XM_NAVBAR_BREAKPOINT_CONFIG_DEFAULT,
    XmNavbarBreakpoint,
    XmNavbarBreakpointConfig,
    XmNavbarOpenState,
} from './xm-navbar-breakpoint.config';
import { XM_NAVBAR_STATE_CONFIG_DEFAULT, XmNavbarState } from './xm-navbar-state';

@Component({
    selector: 'xm-navbar-toggle-widget',
    template: `
        <button *xmIfSession
                (click)="toggleSidebar()"
                [ngClass]="{'toggled': state.openState === XmNavbarOpenState.Open}"
                class="navbar-toggler btn btn-icon btn-just-icon btn-link btn-no-ripple"
                mat-icon-button
                type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
        </button>
    `,
    styleUrls: ['./xm-navbar-toggle-widget.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarToggleWidget implements OnInit, OnDestroy {
    public XmNavbarOpenState = XmNavbarOpenState;
    public state: XmNavbarState = XM_NAVBAR_STATE_CONFIG_DEFAULT;
    private breakpointConfig: XmNavbarBreakpointConfig = XM_NAVBAR_BREAKPOINT_CONFIG_DEFAULT;

    constructor(
        private xmSidebarStoreService: XmSidebarStoreService,
        private breakpointObserver: BreakpointObserver,
    ) {
    }

    public ngOnInit(): void {
        this.breakpointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
                Breakpoints.Handset,
                Breakpoints.Tablet,
                Breakpoints.Web,
                Breakpoints.HandsetPortrait,
                Breakpoints.TabletPortrait,
                Breakpoints.WebPortrait,
                Breakpoints.HandsetLandscape,
                Breakpoints.TabletLandscape,
                Breakpoints.WebLandscape,
            ])
            .subscribe((result) => {
                if (!result.matches) {
                    return;
                }

                if (result.breakpoints[Breakpoints.XSmall]) {
                    this.state.navbarBreakpoint = this.breakpointConfig[XmNavbarBreakpoint.Handset];
                } else if (result.breakpoints[Breakpoints.Small]) {
                    this.state.navbarBreakpoint = this.breakpointConfig[XmNavbarBreakpoint.Handset];
                } else if (result.breakpoints[Breakpoints.Medium]) {
                    this.state.navbarBreakpoint = this.breakpointConfig[XmNavbarBreakpoint.Tablet];
                } else if (result.breakpoints[Breakpoints.Large]) {
                    this.state.navbarBreakpoint = this.breakpointConfig[XmNavbarBreakpoint.Web];
                } else if (result.breakpoints[Breakpoints.XLarge]) {
                    this.state.navbarBreakpoint = this.breakpointConfig[XmNavbarBreakpoint.Web];
                }

                this.updateState();
            });

        this.xmSidebarStoreService.onPresentationChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(i => {
                const isOpen = i === this.state.navbarBreakpoint[XmNavbarOpenState.Open].presentationType;
                let newState: XmNavbarOpenState;
                if (isOpen) {
                    newState = XmNavbarOpenState.Open;
                } else {
                    newState = XmNavbarOpenState.Close;
                }

                if (this.state.openState === newState) {
                    return;
                }

                this.state.openState = newState;
                this.updateState();
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public toggleSidebar(): void {
        switch (this.state.openState) {
            case XmNavbarOpenState.Close:
                this.state.openState = XmNavbarOpenState.Open;
                break;
            case XmNavbarOpenState.Open:
                this.state.openState = XmNavbarOpenState.Close;
                break;
        }
        this.updateState();
    }

    private updateState(): void {
        switch (this.state.openState) {
            case XmNavbarOpenState.Close:
                break;
            case XmNavbarOpenState.Open:
                break;
        }
        const breakpointState = this.state.navbarBreakpoint[this.state.openState];
        this.xmSidebarStoreService.setPresentationType(breakpointState.presentationType);
    }

}
