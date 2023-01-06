import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { DashboardStore } from '@xm-ngx/dashboard';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { iif, Observable, of } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { getApplicationTypeKey } from '@xm-ngx/shared/operators/entity-list-helper';
import { XM_EVENT_LIST } from '../../../../src/app/xm.constants';

interface SearchConfig {
    search: {
        searchFullMatch: boolean;
        searchPanel: boolean;
    },
    applications?: {
        config?: any;
    };
}

@Component({
    selector: 'xm-navbar-search-widget',
    template: `
        <ng-container *xmPermission="config.permission">
            <form (submit)="search($event, searchBox.value)"
                  *ngIf="isShowSearchPanel && (isSessionActive$ | async)"
                  class="d-flex flex-row align-items-center xm-search-global"
                  role="search">

                <mat-form-field class="xm-navbar-search-widget-control">
                    <input #searchBox
                           matInput
                           [regexp]="searchMask"
                           [placeholder]="'navbar.search' | translate"
                           type="text"
                           xmInputPattern>
                </mat-form-field>

                <button mat-icon-button>
                    <mat-icon>search</mat-icon>
                </button>
            </form>
        </ng-container>
    `,
    styleUrls: ['./xm-navbar-search-widget.component.scss'],
})

export class XmNavbarSearchWidget implements OnInit {
    @Input() @Defaults({}) public config: { permission: string[] };

    public searchMask: string = '';
    public isShowSearchPanel: boolean;
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    private searchFullMatch: boolean = false;
    private applicationsConfig: any;

    constructor(
        private router: Router,
        private uiConfigService: XmUiConfigService<SearchConfig>,
        private dashboardWrapperService: DashboardStore,
        private location: Location,
        private xmSessionService: XmSessionService,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        this.uiConfigService.config$().pipe(
            filter((i) => Boolean(i)),
            takeUntilOnDestroy(this),
        ).subscribe((res) => {
            this.applicationsConfig = res.applications && res.applications.config;
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
        const searchedByTemplate: boolean = this.searchByApplicationTemplate(term);
        if (term && !searchedByTemplate) {
            const searchQuery = this.searchFullMatch ? `"${term}"` : term;
            this.router.navigate(['/search'], {
                queryParams: {
                    query: searchQuery,
                    dashboardId: this.getDashboardId(),
                },
            });
        }
    }

    private searchByApplicationTemplate(term: string): boolean {
        let searchTemplateFound = false;

        if (!term) {
            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS});
            return searchTemplateFound;
        }

        if (term && getApplicationTypeKey(this.location.path(false))) {
            this.applicationsConfig.entities && this.applicationsConfig.entities.forEach(entity => {
                if (entity.typeKey === getApplicationTypeKey(this.location.path(false)) && entity.globalSearchTemplate) {
                    searchTemplateFound = true;
                    this.eventManager.broadcast({
                        name: XM_EVENT_LIST.XM_LOAD_ENTITY_LIST_WITH_TEMPLATE,
                        content: { query: term, typeKey: entity.typeKey, template: entity.globalSearchTemplate },
                    });
                }
            });
        }

        return searchTemplateFound;
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
