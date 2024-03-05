import { ChangeDetectorRef, Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { environment } from '@xm-ngx/core/environment';
import { Spec, XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmLoggerService } from '@xm-ngx/logger';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Page, PageService } from '@xm-ngx/core/dashboard';
import { Dashboard } from '@xm-ngx/core/dashboard';
import { DashboardBase } from './dashboard-base';
import { PageTitleService } from './page-title.service';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { from, of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';
import { XmDynamicControllerInjectorFactoryService } from '@xm-ngx/dynamic';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangebleDirectiveService } from '@xm-ngx/dashboard/src/changeable/changeble-directive.service';
import { DashboardCollection } from '@xm-ngx/administration/dashboards-config';
import { XmEventManager } from '@xm-ngx/core';


@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [PageTitleService,DashboardCollection],
})
export class DashboardComponent extends DashboardBase implements OnInit, OnDestroy {
    public childrenDashboards: Dashboard[] = [];

    public dashboard: Dashboard = {isPublic: false};
    public showLoader: boolean;
    public spec: Spec;
    public injector: Injector;
    protected dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);
    private componentInjector = inject(Injector);
    public isEdit: boolean = false;
    public EDIT_EVENT: string = 'EDIT_WIDGET_EVENT';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cdf: ChangeDetectorRef,
                private dashboardStore: DashboardStore,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private changebleDirectiveService: ChangebleDirectiveService,
                protected readonly dashboardCollection: DashboardCollection,
                protected readonly eventManager: XmEventManager,
                private pageService: PageService<Page<{ slug?: string }>>,
                loggerService: XmLoggerService,
                pageTitleService: PageTitleService,
    ) {
        super(loggerService.create({name: 'DashboardComponent'}));
        pageTitleService.init();
    }

    public ngOnInit(): void {
        this.isEdit=this.changebleDirectiveService.getEditStorageState();
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);

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
                        this.router.navigateByUrl('/accessdenied');
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

        this.changebleDirectiveService.getValue()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isEdit) => {
                this.isEdit = isEdit;
            });
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

    public drop(event: CdkDragDrop<any[]>): void {
        if (event.previousContainer === event.container) {
            this.dashboard.layout.layout[0].content;
            moveItemInArray(this.dashboard.layout.layout[0].content, event.previousIndex, event.currentIndex);
        }
    }

    public updateDashboard(): void {
        const content=this.transformWidgetsArray(this.dashboard.layout.layout[0].content);
        this.dashboard.layout.layout[0].content=content;
        delete this.dashboard.layout.grid;
        this.dashboardCollection.update(this.dashboard).pipe().subscribe((res) => {
            this.eventManager.broadcast({name: this.EDIT_EVENT, id: res.id, edit: true});
        });
    }


    public transformWidgetsArray(widgetsArray: any[]): any {
        const content = widgetsArray.map(widget => {
            if (widget.hasOwnProperty('class')) {
                return {
                    class: widget.class,
                    widgetName: widget.widgetName,
                };
            }
            return {
                widgetName: widget.widgetName,
            };

        });
        return content;
    }
}
