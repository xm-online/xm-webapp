import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { DashboardWrapperService } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { iif, Observable, of } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

@Component({
    selector: 'xm-navbar-input-search',
    template: `
        <div *ngIf="isShowSearchPanel && isSessionActive" class="navbar-container-part search-part">
            <form class="navbar-form navbar-right" role="search">
                <div class="input-group no-border">
                    <input #searchBox [regexp]="searchMask"
                           class="search-input"
                           placeholder="{{ 'navbar.search' | translate }}"
                           type="text"
                           xmInputPattern>
                    <button (click)="search(searchBox.value)"
                            class="bg-white rounded-circle shadow-sm mr-2"
                            mat-icon-button
                            type="submit">
                        <i class="material-icons">search</i>
                        <div class="ripple-container"></div>
                    </button>
                </div>
            </form>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarInputSearchComponent implements OnInit {
    public searchMask: string = '';
    public isShowSearchPanel: boolean = true;
    public isSessionActive: boolean;

    constructor(
        private router: Router,
        private uiConfigService: XmUiConfigService<{ searchPanel: boolean }>,
        private dashboardWrapperService: DashboardWrapperService,
        private location: Location,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnInit(): void {
        this.xmSessionService.isActive()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isActive) => this.isSessionActive = isActive);

        this.uiConfigService.config$().pipe(
            filter((i) => Boolean(i)),
            takeUntilOnDestroy(this),
        ).subscribe((res) => {
            this.isShowSearchPanel = Object.prototype.hasOwnProperty.call(res, 'searchPanel') ? res.searchPanel : true;
        });

        this.router.events.pipe(takeUntilOnDestroy(this)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (this.getDashboardId()) {
                    this.getSearchMask().pipe(
                        tap((mask) => this.searchMask = mask),
                    ).subscribe();
                }
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public search(term: string): void {
        if (term) {
            this.router.navigate(['/search'], { queryParams: { query: term, dashboardId: this.getDashboardId() } });
        }
    }

    private getDashboardId(): number | string {
        if (this.location.path(false).includes('dashboard')) {
            const url = this.location.path(false).split('/');
            return url[url.indexOf('dashboard') + 1];
        }
        return null;
    }

    private getSearchMask(): Observable<string> {
        const condition = (dash) => Boolean(dash && dash.config && dash.config.search && dash.config.search.mask);
        const expr = (dash) => of((dash && dash.config && dash.config.search && dash.config.search.mask));
        const f$ = of('');
        return this.dashboardWrapperService.getDashboardByIdOrSlug(this.getDashboardId())
            .pipe(
                // Get 1 or '' depending from condition
                mergeMap((dashboard) => iif(() => condition(dashboard), expr(dashboard), f$)),
            );
    }

}
