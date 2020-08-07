import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { DashboardWrapperService } from '@xm-ngx/dashboard';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { iif, Observable, of } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

interface SearchConfig {
    search: {
        searchFullMatch: boolean;
        searchPanel: boolean;
    }
}

@Component({
    selector: 'xm-navbar-input-search',
    template: `
        <form (submit)="search($event, searchBox.value)"
              *ngIf="isShowSearchPanel && (isSessionActive$ | async)"
              class="d-none d-md-block xm-search-global"
              role="search">

            <mat-form-field floatLabel="never">
                <input #searchBox
                       matInput
                       [regexp]="searchMask"
                       class="search-input"
                       [placeholder]="'navbar.search' | translate"
                       type="text"
                       xmInputPattern>
            </mat-form-field>

            <button class="search-btn bg-white rounded-circle shadow-sm mr-2"
                    mat-icon-button>
                <mat-icon>search</mat-icon>
            </button>
        </form>
    `,
    styleUrls: ['./xm-navbar-input-search.component.scss'],
})

export class XmNavbarInputSearchComponent implements OnInit {
    public searchMask: string = '';
    public isShowSearchPanel: boolean;
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    private searchFullMatch: boolean = false;

    constructor(
        private router: Router,
        private uiConfigService: XmUiConfigService<SearchConfig>,
        private dashboardWrapperService: DashboardWrapperService,
        private location: Location,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnInit(): void {
        this.uiConfigService.config$().pipe(
            filter((i) => Boolean(i)),
            takeUntilOnDestroy(this),
        ).subscribe((res) => {
            if (!res.search) {
                this.isShowSearchPanel = true;
            } else {
                this.searchFullMatch = res.search.searchFullMatch;
                this.isShowSearchPanel = res.search.searchPanel;
            }
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

    public search(e: Event, term: string): void {
        e.preventDefault();
        if (term) {
            const searchQuery = this.searchFullMatch ? `"${term}"` : term;
            this.router.navigate(['/search'], {
                queryParams: {
                    query: searchQuery,
                    dashboardId: this.getDashboardId(),
                },
            });
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
