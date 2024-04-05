import { Component, Injector, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Locale, TitleService, XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { XmUIConfig } from '@xm-ngx/core/config';
import { XmDynamicModule, XmDynamicSelector } from '@xm-ngx/dynamic';
import { firstValueFrom } from 'rxjs';

interface PublicUiErrorConfig {
    title: Record<Locale, string>;
    componentSelector: XmDynamicSelector;
    componentConfig: any;
}

interface XmErrorConfig extends XmUIConfig {
    xmError: {
        error403: PublicUiErrorConfig;
        error404: PublicUiErrorConfig;
    }
}

@Component({
    selector: 'xm-error',
    template: `
        @if(dynamicErrorComponent) {
            <ng-template
                    xm-dynamic-widget
                    [init]="{
                    selector: dynamicErrorComponent,
                    config: dynamicErrorComponentConfig || {},
                    controllers: [],
                    injector: componentInjector
            }">
            </ng-template>
        } @else {
        <div>
            <div class="row">
                <div class="col-md-4">
                    <span class="hipster img-fluid img-rounded"></span>
                </div>
                <div class="col-md-8">
                    <h1>{{'error.title'|translate}}</h1>

                    <div [hidden]="!errorMessage">
                        <div class="alert alert-danger">{{errorMessage}}
                        </div>
                    </div>
                    <div [hidden]="!error403" class="alert alert-danger">
                        {{'error.403'|translate}}
                    </div>
                    <div [hidden]="!error404" class="alert alert-danger">
                        {{'error.notfound'|translate}}
                    </div>
                </div>
            </div>
        </div>
        }
    `,
})
export class ErrorComponent implements OnInit {
    public errorMessage: string;
    public error403: boolean;
    public error404: boolean;
    public dynamicErrorComponent: XmDynamicSelector;
    public dynamicErrorComponentConfig: any;

    constructor(
        private route: ActivatedRoute,
        private xmPublicUiConfigService: XmPublicUiConfigService<XmErrorConfig>,
        private titleService: TitleService,
        private xmTranslateService: XmTranslateService,
        public componentInjector: Injector,
    ) { }

    public async ngOnInit(): Promise<void> {
        const routeData = await firstValueFrom(this.route.data);
        const uiConfig = await firstValueFrom(this.xmPublicUiConfigService.config$());
        if (routeData.error403) {
            this.error403 = routeData.error403;
            const errorConfig = uiConfig?.xmError?.error403;
            this.handleDynamicErrorComponent(errorConfig);
        }
        if (routeData.error404) {
            this.error404 = routeData.error404;
            const errorConfig = uiConfig?.xmError?.error404;
            this.handleDynamicErrorComponent(errorConfig);
        }
        if (routeData.errorMessage) {
            this.errorMessage = routeData.errorMessage;
        }
    }

    private handleDynamicErrorComponent(errorConfig: PublicUiErrorConfig) {
        if (errorConfig?.title) {
            const title = this.xmTranslateService.translate(errorConfig.title);
            if (title) {
                this.titleService.set(title);
                this.route.snapshot.data.pageTitle = title;
            }
        }
        if (errorConfig?.componentSelector) {
            this.dynamicErrorComponent = errorConfig.componentSelector;
            this.dynamicErrorComponentConfig = errorConfig.componentConfig;
        }
    }
}

@NgModule({
    imports: [
        RouterModule.forChild([{path: '', component: ErrorComponent}]),
        XmTranslationModule,
        XmDynamicModule,
    ],
    exports: [ErrorComponent],
    declarations: [ErrorComponent],
    providers: []
})
export class ErrorModule {
}


