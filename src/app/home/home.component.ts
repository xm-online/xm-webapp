import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { Widget } from '@xm-ngx/dashboard';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { combineLatest } from 'rxjs';
import { DashboardBase } from '../xm-dashboard/dashboard/dashboard-base';

@Component({
    selector: 'xm-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent extends DashboardBase implements OnInit, OnDestroy {

    public hide: boolean = true;
    public defaultWidget: Widget;
    public defaultLayout: Layout;
    public signWidget: Widget = this.getWidgetComponent({ selector: 'ext-common/xm-widget-sign-in-up' });

    constructor(
        private xmConfigService: XmUiConfigService,
        private sessionService: XmSessionService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {
        combineLatest([
            this.xmConfigService.config$(),
            this.sessionService.isActive(),
        ]).pipe(
            takeUntilOnDestroy(this),
        ).subscribe(
            ([config, active]) => {
                if (active === true) {
                    this.hide = true;
                    this.router.navigate(['/dashboard']);
                    return;
                }
                this.hide = false;
                if (config && config.defaultLayout) {
                    this.defaultLayout = config.defaultLayout.map((row) => {
                        row.content = row.content.map((el) => {
                            el.widget = this.getWidgetComponent(el.widget);
                            return el;
                        });
                        return row;
                    });
                } else {
                    this.defaultWidget = this.getWidgetComponent(config?.defaultWidget);
                }
            },
            () => this.defaultWidget = this.getWidgetComponent());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
