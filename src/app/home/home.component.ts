import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Widget } from '@xm-ngx/dashboard';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthServerProvider } from '../shared';
import { XmConfigService } from '../shared/spec/config.service';
import { DashboardBase } from '../xm-dashboard/dashboard/dashboard-base';
import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE } from '../xm.constants';

@Component({
    selector: 'xm-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent extends DashboardBase implements OnInit, OnDestroy {

    public defaultWidget: Widget;
    public defaultLayout: Layout;
    public signWidget: Widget = this.getWidgetComponent({ selector: 'ext-common/xm-widget-sign-in-up' });

    constructor(
        private xmConfigService: XmConfigService,
        private http: HttpClient,
        private authServerProvider: AuthServerProvider,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.getAccessToken().subscribe(() => {
            this.xmConfigService.getUiConfig().subscribe((result) => {
                if (result) {
                    if (result.defaultLayout) {
                        this.defaultLayout = result.defaultLayout.map((row) => {
                            row.content = row.content.map((el) => {
                                el.widget = this.getWidgetComponent(el.widget);
                                return el;
                            });
                            return row;
                        });
                    } else {
                        this.defaultWidget = this.getWidgetComponent(result.defaultWidget);
                    }
                } else {
                    this.defaultWidget = this.getWidgetComponent();
                }
            }, (err) => {
                console.warn(err);
                this.defaultWidget = this.getWidgetComponent();
            });
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getAccessToken(): Observable<void> {
        const data = new HttpParams().set('grant_type', 'client_credentials');
        const headers = {
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Authorization: DEFAULT_AUTH_TOKEN,
        };
        return this.http.post<any>('uaa/oauth/token', data, { headers, observe: 'response' })
            .pipe(map((resp) => {
                this.authServerProvider.loginWithToken(resp.body.access_token, false);
            }));
    }

}
