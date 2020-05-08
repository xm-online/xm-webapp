import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Principal } from '@xm-ngx/core/auth';

import { environment } from '@xm-ngx/core/environment';
import { Spec, XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmConfigService } from '../../shared/spec/config.service';
import { PageService } from '../page/page.service';
import { DashboardWrapperService } from '../shared/dashboard-wrapper.service';
import { Dashboard } from '../shared/dashboard.model';
import { Widget } from '../shared/widget.model';
import { DashboardBase } from './dashboard-base';
import { PageTitleService } from './page-title.service';
import { sortByOrderIndex } from './sortByOrderIndex';

interface DashboardLayout {
    widget?: number | string | Widget;
    widgetName?: string;

    [key: string]: DashboardLayout | any;
}

@Component({
    selector: 'xm-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [PageTitleService],
})
export class DashboardComponent extends DashboardBase implements OnInit, OnDestroy {

    public dashboard: Dashboard = {isPublic: false};
    public showLoader: boolean;
    public spec: Spec;

    private routeSubscription: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private dashboardWrapperService: DashboardWrapperService,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private principal: Principal,
                private pageService: PageService,
                pageTitleService: PageTitleService,
                private xmConfigService: XmConfigService,
    ) {
        super();
        pageTitleService.init();
    }

    public ngOnInit(): void {
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);
        this.routeSubscription = this.route.params.subscribe((params) => {
            if (params.id) {
                this.load(params.id);
                this.pageService.load(params.id);
            } else {
                this.rootRedirect();
            }
        });
    }

    public ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    public rootRedirect(): void {
        this.principal.identity()
            .then(() => this.principal.hasPrivileges(['DASHBOARD.GET_LIST'])
                .then((result) => {
                    if (result) {
                        this.xmConfigService.getUiConfig().subscribe((config) => {
                            if ('defaultDashboard' in config && config.defaultDashboard.length) {
                                if (typeof config.defaultDashboard === 'string') {
                                    const slugs = [];
                                    slugs.push(config.defaultDashboard);
                                    this.checkAndRedirect(slugs);
                                } else {
                                    this.checkAndRedirect(config.defaultDashboard);
                                }
                            } else {
                                if (!environment.production) {
                                    console.info('rootRedirect');
                                }
                                this.dashboardWrapperService.dashboards().then((dashboards) => {
                                        if (dashboards && dashboards.length && dashboards[0].id) {
                                            const key = dashboards[0].config && dashboards[0].config.slug
                                                ? dashboards[0].config.slug : dashboards[0].id;
                                            this.router.navigate(['/dashboard', key]);
                                        }
                                    },
                                );
                            }
                        });
                    }
                }),
            );
    }

    public load(idOrSlug: any): void {
        this.showLoader = true;
        if (!environment.production) {
            console.info(`load ${idOrSlug}`);
        }
        this.dashboardWrapperService.dashboards().then((dashboards) => {
                if (dashboards && dashboards.length) {
                    this.dashboard = dashboards.filter((d) => (d.config && d.config.slug === idOrSlug)
                        || d.id === parseInt(idOrSlug, 10)).shift();
                    // TODO temporary fix for override widget variables
                    this.dashboard = JSON.parse(JSON.stringify(this.dashboard || ''));
                    if (this.dashboard && this.dashboard.id) {
                        this.loadDashboard(this.dashboard.id);
                    } else {
                        console.info('No dashboard found by %s', idOrSlug);
                        this.rootRedirect();
                    }
                }
            },
        );
    }

    public loadDashboard(id: any): void {
        if (!environment.production) {
            console.info(`load dashboard ${id}`);
        }

        this.dashboardWrapperService
            .getDashboardByIdOrSlug(id).subscribe((result) => {
                const widgets = sortByOrderIndex(result && result.widgets ? result.widgets : []);
                Object.assign(this.dashboard, {
                    widgets: this.getWidgetsComponent(widgets),
                });

                if (this.dashboard.layout && this.dashboard.layout.layout) {
                    this.findAndEnrichWidget(this.dashboard.layout.layout, widgets);
                    this.dashboard.layout.grid = this.dashboard.layout.layout;
                } else {
                    this.dashboard.layout = {};
                    this.dashboard.layout.grid = widgets.map((w) => this.defaultGrid(w));
                }

            },
            () => {
                console.info('No dashboard found by %s', id);
                this.showLoader = false;
            },
            () => (this.showLoader = false),
        );
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

    private findAndEnrichWidget(layout: DashboardLayout, widgets: Widget[]): void {
        Object.keys(layout).forEach((k) => {
            if (k === 'widget') {
                layout.widget = widgets.find((w) => w.id === layout[k]);
            }

            if (k === 'widgetName') {
                layout.widget = widgets.find((w) => w.name === layout[k]);
            }

            if (layout[k] && typeof layout[k] === 'object') {
                this.findAndEnrichWidget(layout[k], widgets);
            }
        });
    }

    private defaultGrid(el: Widget): { class: string; content: Array<{ widget: Widget; class: string }> } {
        return {
            class: 'row mx-md-0',
            content: [
                {
                    class: 'col-sm-12',
                    widget: el,
                },
            ],
        };
    }

    // Tslint:disable-next-line:cognitive-complexity
    private checkAndRedirect(slugs: any[]): void {
        const configSlugs = slugs instanceof Array ? slugs : [];
        let slugToGo = null;
        if (!environment.production) {
            console.info('checkAndRedirect');
        }
        this.dashboardWrapperService.dashboards().then((dashboards) => {
            configSlugs.forEach((slug) => {
                if (dashboards && dashboards.length) {
                    for (const d of dashboards) {
                        const dSlug = d && d.config && d.config.slug ? d.config.slug : null;
                        if (dSlug === slug) {
                            slugToGo = slug;
                            break;
                        }
                    }
                }
            });

            if (slugToGo) {
                this.router.navigate(['/dashboard', slugToGo]);
            } else {
                if (dashboards && dashboards.length && dashboards[0].id) {
                    const key = dashboards[0].config && dashboards[0].config.slug
                        ? dashboards[0].config.slug : dashboards[0].id;
                    this.router.navigate(['/dashboard', key]);
                }
            }
        });
    }
}
