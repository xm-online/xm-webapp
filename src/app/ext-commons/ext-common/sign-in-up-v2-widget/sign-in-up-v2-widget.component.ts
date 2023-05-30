import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { LanguageService, XmTranslationModule } from '@xm-ngx/translation';
import { XmConfigService } from '@xm-ngx/core/config';
import { XmDynamicModule, XmDynamicWidget } from '@xm-ngx/dynamic';
import { LoaderModule } from '@xm-ngx/components/loader';
import { MatButtonModule } from '@angular/material/button';
import { XmSharedModule } from '@xm-ngx/shared';
import { SignInMarketingComponent } from './sign-in-marketing/sign-in-marketing.component';
import { LoginV2Component } from './login-v2/login-v2.component';
import { SignInUpFooterComponent } from './sign-in-up-footer/sign-in-up-footer.component';
import { XmNavbarLanguageMenuWidget } from '@xm-ngx/dashboard/language-menu';
import { LoginTfaComponent } from './login-tfa/login-tfa.component';
import { SignInUpService } from './sign-in-up.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { SignPageConfig } from './sign-in-up-v2.model';

@Component({
    selector: 'xm-sign-in-up-v2-widget',
    templateUrl: './sign-in-up-v2-widget.component.html',
    styleUrls: ['./sign-in-up-v2-widget.component.scss'],
    standalone: true,
    imports: [
        LoaderModule,
        XmTranslationModule,
        MatButtonModule,
        XmSharedModule,
        SignInMarketingComponent,
        LoginV2Component,
        SignInUpFooterComponent,
        XmNavbarLanguageMenuWidget,
        LoginTfaComponent,
        XmDynamicModule,
    ],
})
export class SignInUpV2WidgetComponent implements OnInit, OnDestroy, XmDynamicWidget {

    @Input() public config: SignPageConfig;
    public isLoginFormView: boolean = true;
    public loginLabel: string;
    public OTPloaded: boolean = false;
    public token: string = '';
    public phone: string = '';
    public state: string = 'SIGN-IN';

    constructor(
        protected eventManager: XmEventManager,
        protected languageService: LanguageService,
        private route: ActivatedRoute,
        private router: Router,
        protected signInUpService: SignInUpService,
        protected sessionService: XmSessionService,
        protected xmConfigService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.signInUpService.getView().pipe(takeUntilOnDestroy(this)).subscribe((res: string) => {
            this.state = res;
        });
        this.route.queryParams.pipe(takeUntilOnDestroy(this)).subscribe((res) => {
            if (res.page) {
                this.signInUpService.changeView(res.page);
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public changeMode(): void {
        this.isLoginFormView = !this.isLoginFormView;
        this.router.navigate(['.'], {
            queryParams: {},
        });
    }

    public nextStep($event: any): void {
        this.OTPloaded = true;
        this.state = $event.next;
        this.token = $event.access_token;
        this.phone = $event.destination;
        this.router.navigate(['.'], {
            queryParams: {query: $event.next},
        });
        this.sessionCreate($event);
    }

    private sessionCreate($event: any) {
        if (!$event.otpId || $event.headers.get('icthh-xm-tfa-otp') !== 'required') {
            this.sessionService.create();
        }
    }

    public changeStateView(event: string): void {
        this.state = event;
        this.OTPloaded = false;
        this.token = '';
    }
}



