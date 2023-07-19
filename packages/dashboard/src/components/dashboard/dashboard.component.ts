import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '@xm-ngx/core/environment';
import { Spec, XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmLoggerService } from '@xm-ngx/logger';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Page, PageService } from '../../stores/page/page.service';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardBase } from './dashboard-base';
import { PageTitleService } from './page-title.service';
import { DashboardStore } from '../../stores/dashboard-store.service';
import { Observable, of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { DynamicContentService } from '../../stores/dynamic-content/dynamic-content.service';

export interface XmDashboardCustomParamsWidget { 
    module: string; 
    selector: string; 
    config: unknown;
    spec: unknown;
}

export interface XmDashboardCustomParams { 
    widget: XmDashboardCustomParamsWidget;
}

@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [PageTitleService],
})
export class DashboardComponent extends DashboardBase implements OnInit, OnDestroy {
    public childrenDashboards: Dashboard[] = [];

    public dynamicContent: Observable<unknown>;
    public hasDynamicContent: Observable<boolean>;

    public dashboard: Dashboard = { isPublic: false };
    public showLoader: boolean;
    public spec: Spec;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cdf: ChangeDetectorRef,
                private dashboardStore: DashboardStore,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private pageService: PageService<Page<{ slug?: string }>>,
                private dynamicContentService: DynamicContentService,
                loggerService: XmLoggerService,
                pageTitleService: PageTitleService,
    ) {
        super(loggerService.create({ name: 'DashboardComponent' }));
        pageTitleService.init();
    }

    public ngOnInit(): void {
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);

        this.route.params
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.showLoader = true;
                this.dashboard = null;
                this.closeDynamicContent();
                this.cdf.detectChanges();
                this.pageService.load(this.route.snapshot.data?.dashboard?.id || null);
            });

        this.pageService.active$()
            .pipe(
                tap((page) => {
                    if (!page) {
                        this.router.navigateByUrl(environment.notFoundUrl);
                        return;
                    }
                    this.logger.info(`Dashboard is loaded name="${page.name}" id="${page.id}".`);
                    this.dashboard = this.loadDashboard(page);

                    this.showLoader = false;
                }),
                switchMap((page) => {
                    if (!this.dashboard) {
                        return of(page);
                    }

                    if (this.dashboard.config.slug
                        && (this.dashboard.widgets.length == 0 || this.dashboard?.layout?.grid?.length == 0)
                    ) {
                        return this.dashboardStore.getByParentSlug(this.dashboard.config.slug, true).pipe(
                            tap((childrenDashboards) => {
                                this.childrenDashboards = childrenDashboards;
                            }),
                            mapTo(page),
                        );
                    }

                    return of(page);
                }),
                takeUntilOnDestroy(this),
            ).subscribe();

        this.dynamicContent = this.dynamicContentService.content;
        this.hasDynamicContent = this.dynamicContentService.hasContent();
    }

    public closeDynamicContent(): void {
        this.dynamicContentService.clearContent();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public isCustomElement(layout: { widget: unknown }): boolean {
        return Boolean(layout.widget);
    }

    public resolveCustomParams(layout: XmDashboardCustomParams): XmDashboardCustomParamsWidget {
        return {
            module: layout.widget.module,
            selector: layout.widget.selector,
            config: layout.widget.config,
            spec: this.spec,
        };
    }
}
