import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { Widget } from '@xm-ngx/dashboard';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { cloneDeep } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardBase } from '../xm-dashboard/dashboard/dashboard-base';

interface HomeLayout extends Layout {
    content?: HomeLayout[];
    config?: unknown;
}

interface HomeRootLayouts extends Layout {
    domain: string | string[];
}

interface HomeConfig {
    root?: {
        layouts: HomeRootLayouts[];
    };
    /** @deprecated use root instead */
    defaultLayout: Widget[];
    /** @deprecated use root instead */
    defaultWidget: Widget;
}

@Component({
    selector: 'xm-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent extends DashboardBase implements OnInit, OnDestroy {

    public layouts$: Observable<HomeLayout[]>;

    constructor(
        private xmConfigService: XmUiConfigService<HomeConfig>,
        private sessionService: XmSessionService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.layouts$ = combineLatest([
            this.xmConfigService.config$(),
            this.sessionService.isActive(),
        ]).pipe(
            takeUntilOnDestroy(this),
            map(
                ([config, active]) => {
                    if (active === true) {
                        this.router.navigate(['/dashboard']);
                        return [];
                    }

                    if (config?.root?.layouts) {
                        return this.getFromConfigRootLayouts(config.root.layouts);
                    }
                    if (config?.defaultLayout) {
                        return this.getFromConfigDefaultLayout(config.defaultLayout);
                    } else {
                        return this.getFromConfigDefaultWidget(config);
                    }
                }),
            catchError(() => of(this.getFromConfigDefaultWidget())),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    protected getFromConfigRootLayouts(layouts: HomeRootLayouts[]): HomeLayout[] {
        return cloneDeep(layouts.filter(l => this.hasCurrentDomain(l.domain)));
    }

    protected getFromConfigDefaultLayout(defaultLayout: HomeLayout[]): HomeLayout[] {
        return cloneDeep(defaultLayout.map((row) => ({
            selector: row.selector || 'div',
            class: row.class,
            config: row.config,
            content: row.content.map((el) => {
                const widget = this.getWidgetComponent((el as any).widget);
                return {
                    selector: el.selector || 'div',
                    class: el.class,
                    config: row.config,
                    content: [{ selector: widget.selector, config: widget.confi }],
                };
            }),
        })));
    }

    protected getFromConfigDefaultWidget(config?: HomeConfig): HomeLayout[] {
        const dLeft = this.getWidgetComponent(config?.defaultWidget);
        const dRight = this.getWidgetComponent({ selector: 'ext-common/xm-widget-sign-in-up' });
        return ([
            {
                selector: 'div',
                class: 'row default-row',
                content: [
                    {
                        selector: 'div',
                        class: 'col-md-6 default-lef-col',
                        content: [{ selector: dLeft.selector, config: dLeft.config }],
                    },
                    {
                        selector: 'div',
                        content: [{ selector: dRight.selector, config: dRight.config }],
                        class: 'col-md-6 default-right-col',
                    },
                ],
            },
        ]);
    }

    private hasCurrentDomain(domain: string | string[]): boolean {
        if (!domain || domain.length === 0) {
            return true;
        }

        const domains: string[] = Array.isArray(domain) ? domain : [domain];
        return domains.includes(window.location.hostname);
    }
}
