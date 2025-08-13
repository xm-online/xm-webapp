import { ChangeDetectorRef, Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dashboard, DashboardStore, Page, PageService } from '@xm-ngx/core/dashboard';
import { XmDynamicControllerInjectorFactoryService } from '@xm-ngx/dynamic';

// import { environment } from '@xm-ngx/core/environment';
import { Spec, XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmLoggerService } from '@xm-ngx/logger';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { BehaviorSubject, combineLatest, from, of, merge } from 'rxjs';
import { map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { DashboardBase } from './dashboard-base';
import { PageTitleService } from './page-title.service';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';


@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [PageTitleService],
    standalone: false,
})
export class DashboardComponent extends DashboardBase implements OnInit, OnDestroy {
    public childrenDashboards: Dashboard[] = [];

    public dashboard: Dashboard = {isPublic: false};
    public showLoader: boolean;
    public spec: Spec;
    public injector: Injector;
    private readonly loggingOut$ = new BehaviorSubject<boolean>(false);
    public readonly show$ = combineLatest([
        this.session.isActive().pipe(startWith(false)),
        this.loggingOut$,
    ]).pipe(
        map(([active, loggingOut]) => active && !loggingOut)
    );
    protected dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);
    private componentInjector = inject(Injector);

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cdf: ChangeDetectorRef,
                private dashboardStore: DashboardStore,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private pageService: PageService<Page<{ slug?: string }>>,
                private session: XmSessionService,
                private eventManager: XmEventManager,
                loggerService: XmLoggerService,
                pageTitleService: PageTitleService,
    ) {
        super(loggerService.create({name: 'DashboardComponent'}));
        pageTitleService.init();
    }

    public ngOnInit(): void {
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);
        this.observeSessionEvents();
        this.route.params
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.showLoader = true;
                this.dashboard = null;
                this.cdf.detectChanges();
                this.pageService.load(this.route.snapshot.data?.dashboard?.id || null);
            });

        this.pageService.active$()
            .pipe(
                tap((page) => {
                    if (!page) {
                        this.router.navigateByUrl('/not-found');
                        return;
                    }
                    this.logger.info(`Dashboard is loaded name="${page.name}" id="${page.id}".`);
                    this.dashboard = this.loadDashboard(page);
                    this.showLoader = false;
                }),
                switchMap(page => {
                    return from(new Promise(async (resolve, reject) => {
                        if (this.dashboard?.config?.controllers?.length > 0) {
                            this.injector = await this.dynamicControllerInjectorFactory.defineProviders(this.dashboard.config.controllers, [], this.componentInjector);
                        } else {
                            this.injector = this.componentInjector;
                        }
                        resolve(page);
                    }));
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
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public isCustomElement(layout: { widget: unknown }): boolean {
        return Boolean(layout.widget);
    }

    public resolveCustomParams(layout: { widget: { module: string; selector: string; config: unknown } }): unknown {
        return {
            module: layout.widget.module,
            selector: layout.widget.selector,
            config: layout.widget.config,
            spec: this.spec,
        };
    }

    private observeSessionEvents(): void {
        this.eventManager.listenTo('USER-LOGOUT-INIT')
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.loggingOut$.next(true));

        merge(
            this.eventManager.listenTo('USER-LOGOUT'),
            this.eventManager.listenTo('authenticationSuccess'),
        ).pipe(takeUntilOnDestroy(this)).subscribe(() => this.loggingOut$.next(false));
    }
}
