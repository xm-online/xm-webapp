import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { XmConfigService, XmUIConfig } from '@xm-ngx/core/config';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

import { LanguageService } from '@xm-ngx/translation';
import { Subscription } from 'rxjs';

enum XM_EVENT_LIST {
    XM_REGISTRATION = 'xmRegistration',
    XM_CHANGE_LANGUAGE = 'changeLanguage',
}

@Component({
    selector: 'xm-sign-in-up-widget',
    templateUrl: './sign-in-up-widget.component.html',
    styleUrls: ['./sign-in-up-widget.component.scss'],
    standalone: false,
})
export class SignInUpWidgetComponent implements OnInit, OnDestroy, XmDynamicWidget {

    @Input() public config: any;
    public xmUiConfig: XmUIConfig;
    public isLoginFormView: boolean = true;
    public successRegistration: boolean = false;
    public loginLabel: string;
    private registrationSuccessSubscription: Subscription;
    private changeLanguageSubscriber: Subscription;


    constructor(
        private eventManager: XmEventManager,
        private languageService: LanguageService,
        private route: ActivatedRoute,
        private router: Router,
        protected xmConfigService: XmConfigService) {
        this.xmConfigService.getUiConfig().subscribe((cfg: XmUIConfig) => this.xmUiConfig = cfg);
    }

    public ngOnInit(): void {
        this.registrationSuccessSubscription = this.eventManager.listenTo(XM_EVENT_LIST.XM_REGISTRATION)
            .subscribe(() => {
                this.isLoginFormView = true;
                this.successRegistration = true;
            });

        this.changeLanguageSubscriber = this.eventManager.subscribe(XM_EVENT_LIST.XM_CHANGE_LANGUAGE, (event) => {
            if (this.config && this.config.loginLabel) {
                this.updateLabels(this.config.loginLabel, event.content);
            }
        });

        this.route.queryParams.subscribe((params) => {
            if (params.type) {
                this.isLoginFormView = (params.type !== 'registration');
            }
        });
        if (this.config && this.config.loginLabel) {
            this.updateLabels(this.config.loginLabel);
        }
    }

    public ngOnDestroy(): void {
        this.registrationSuccessSubscription.unsubscribe();
        this.changeLanguageSubscriber.unsubscribe();
    }

    public changeMode(): void {
        this.isLoginFormView = !this.isLoginFormView;
        this.successRegistration = false;

        this.router.navigate(['.'], {
            queryParams: {},
        });
    }

    private updateLabels(label: any, currentLang?: string): void {
        const lang = currentLang ? currentLang : this.languageService.locale;
        this.loginLabel = label[lang] || label;
    }
}
