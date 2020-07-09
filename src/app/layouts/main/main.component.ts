import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { LoginService, Principal } from '@xm-ngx/core/auth';

import { environment } from '@xm-ngx/core/environment';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageService, TitleService } from '@xm-ngx/translation';
import { Idle } from 'idlejs/dist';
import { Observable } from 'rxjs';
import { XmConfigService } from '../../shared';
import { XmApplicationConfigService } from '../../shared/spec';
import { XM_EVENT_LIST } from '../../xm.constants';

declare const $: any;

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    providers: [],
})
export class XmMainComponent implements OnInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    private idle: Idle;
    private config: { idleLogout: boolean };
    private isIdleEnabled: boolean;

    constructor(private configService: XmConfigService,
                private xmConfigService: XmApplicationConfigService,
                private router: Router,
                private loginService: LoginService,
                private languageService: LanguageService,
                private principal: Principal,
                protected titleService: TitleService,
                private eventManager: XmEventManager) {
    }

    public ngOnInit(): void {
        this.languageService.init();
        this.titleService.init();
        this.configService.getUiConfig().subscribe((config) => {
            this.config = config ? config : null;
            this.prepareLayout();
            this.registerAuthenticationSuccess();
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.idleLogoutInit();
            }
        });

        // TODO #14219. workaround for dynamic expand height of textarea
        $('body').on('keyup', '.textarea-auto-height textarea', function(this: HTMLElement) {
            this.style.overflow = 'hidden';
            this.style.height = '52px';
            this.style.height = `${this.scrollHeight}px`;
        });

        $(window).resize(() => {
            $('.textarea-auto-height textarea').each((pos, el) => {
                $(el).trigger('keyup');
            });
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private registerAuthenticationSuccess(): void {
        this.eventManager.listenTo(XM_EVENT_LIST.XM_SUCCESS_AUTH)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.principal.identity();
                this.isGuestLayout = false;
            });
    }

    private idleLogoutInit(): void {
        let userAutoLogoutEnabled = false;
        let userAutoLogoutSeconds = null;
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
        this.isIdleEnabled = false;
        if (this.principal.isAuthenticated()) {
            this.principal.identity().then((account) => {
                if (account) {
                    userAutoLogoutEnabled = account.autoLogoutEnabled || false;
                    userAutoLogoutSeconds = account.autoLogoutTimeoutSeconds || null;
                }
                const authenticated = this.principal.isAuthenticated();
                if (authenticated && !this.isIdleEnabled && userAutoLogoutEnabled && userAutoLogoutSeconds) {
                    this.idleAction(userAutoLogoutSeconds);
                    return undefined;
                }
                if (this.config && this.config.idleLogout && authenticated && !this.isIdleEnabled) {
                    this.idleAction(this.config.idleLogout);
                }
            });
        }
    }

    private idleAction(time: any): void {
        if (!environment.production) {
            console.info(`>>> init idle logout in ${time}`);
        }
        this.isIdleEnabled = true;
        this.idle = new Idle()
            .whenNotInteractive()
            .within(parseFloat(time), 1000)
            .do(() => {
                this.loginService.logout();
                this.isIdleEnabled = false;
            })
            .start();
    }

    private prepareLayout(): void {
        this.isGuestLayout = true;
        this.principal.getAuthenticationState().subscribe((auth) => {
            if (!auth) {
                this.isGuestLayout = true;
            } else {
                this.isGuestLayout = false;
            }
        }, (error) => {
            console.info(error);
            this.isGuestLayout = false;
        });
    }

}
