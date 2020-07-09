import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TERMS_ERROR, XM_EVENT_LIST } from '../../xm.constants';
import { StateStorageService } from '../auth/state-storage.service';
import {
    PrivacyAndTermsDialogComponent,
} from '../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfigService } from '../spec/config.service';
import { LoginService } from './login.service';
import { Principal } from '../auth/principal.service.js';
import { XmEntitySpecWrapperService } from '../../xm-entity/shared/xm-entity-spec-wrapper.service';

declare let $: any;

@Component({
    selector: 'xm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

    @Input() public successRegistration: boolean;
    @Input() public loginLabel: string;
    @Input() public config: any;

    public isShowPassword: boolean = false;
    public isTermsShown: boolean = false;
    public isDisabled: boolean;
    public authenticationError: boolean;
    public password: string;
    public hideRememberMe: boolean;
    public hideResetPasswordLink: boolean;
    public rememberMe: boolean;
    public username: string;
    public credentials: any;
    public checkOTP: boolean;
    public otpValue: string;
    public floatLabel: boolean;
    public sendingLogin: boolean;
    public socialConfig: [];

    public checkTermsOfConditions: boolean;

    constructor(
        protected eventManager: JhiEventManager,
        protected xmConfigService: XmConfigService,
        protected loginService: LoginService,
        protected stateStorageService: StateStorageService,
        protected elementRef: ElementRef,
        protected router: Router,
        protected alertService: JhiAlertService,
        protected modalService: NgbModal,
        protected principal: Principal,
        protected xmEntitySpecWrapperService: XmEntitySpecWrapperService,
    ) {
        this.checkOTP = false;
        this.credentials = {};
        this.otpValue = '';
        this.successRegistration = false;
    }

    public ngOnInit(): void {
        $('body').addClass('xm-public-screen');
        this.isDisabled = false;

        this.getConfigs()
            .pipe(
                map((c) => {
                    return {ui: c[0], uaa: c[1] ? c[1] : null};
                }),
            )
            .subscribe((config) => {
                const uiConfig = config && config.ui;
                const uaaConfig = config && config.uaa;
                this.socialConfig = uiConfig && uiConfig.social;
                this.hideRememberMe = uiConfig.hideRememberMe ? uiConfig.hideRememberMe : false;
                this.hideResetPasswordLink = uiConfig.hideResetPasswordLink ? uiConfig.hideResetPasswordLink : false;
                this.checkTermsOfConditions = (uaaConfig && uaaConfig.isTermsOfConditionsEnabled) || false;
            });
    }

    public ngAfterViewInit(): void {
        this.fixAutoFillFieldsChrome();
    }

    public cancel(): void {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true,
        };
        this.authenticationError = false;
        this.successRegistration = false;
    }

    public loginSuccess(): void {
        $('body').removeClass('xm-public-screen');
        if (this.router.url === '/register'
            // eslint-disable-next-line @typescript-eslint/prefer-includes
            || ((/activate/).test(this.router.url))
            || this.router.url === '/finishReset'
            || this.router.url === '/requestReset') {
            this.router.navigate([''], { replaceUrl: true });
        }

        this.eventManager.broadcast({
            name: XM_EVENT_LIST.XM_SUCCESS_AUTH,
            content: 'Sending Authentication Success',
        });

        /*
         * PreviousState was set in the authExpiredInterceptor before being redirected to login modal.
         * since login is succesful, go to stored previousState and clear previousState
         */
        const redirect = this.stateStorageService.getUrl();
        if (redirect) {
            this.router.navigate([redirect], { replaceUrl: true });
        } else {
            this.checkAvailableUrlsAndNavigate();
        }
    }


    private checkAvailableUrlsAndNavigate(): void {
        // const canSeeDash = this.principal
        //     .hasPrivileges(['DASHBOARD.GET_LIST', 'DASHBOARD.GET_LIST.ITEM']);
        const canSeeApps = this.principal
            .hasPrivileges(['XMENTITY_SPEC.GET', 'XMENTITY.GET_LIST'], 'OR', 'login');

        canSeeApps.then((w) => console.warn(w));

        // Promise.all([canSeeDash, canSeeApps])
        //     .then((results: any[]) => {
        //         const privileges = results.map((p, i) => ({index: i, value: p})).filter(p => p.value === true);
        //         console.warn(privileges);
        //         const currentPrivilege = privileges && privileges.length > 0 && privileges[0].index;
        //         switch (currentPrivilege) {
        //             case 0: {
        //                 this.router.navigate(['dashboard'], { replaceUrl: true });
        //                 break;
        //             }
        //             case 1: {
        //                 this.getAppUrlAndNavigate();
        //                 break;
        //             }
        //             default: {
        //                 // Case if has no privileges - logout
        //                 // eslint-disable-next-line max-len
        //                 // @TODO: maybe more valid case would be redirect on some page as "no permitted routes" or such
        //                 this.loginService.logout();
        //             }
        //         }
        //     });
    }

    private getAppUrlAndNavigate(): void {
        this.principal.hasPrivileges(['XMENTITY_SPEC.GET'])
            .then((result) => {
                if (result) {
                    this.xmEntitySpecWrapperService.spec(true).then((spec) => {
                        const applications = spec.types.filter((t) => t.isApp)
                            .filter((t) => this.principal
                                .hasPrivilegesInline([`APPLICATION.${  t.key}`]));
                        if (applications.length > 0) {
                            this.router.navigate([`application/${  applications[0].key}`], { replaceUrl: true });
                        } else {
                            // Case if has no privileges - logout
                            // eslint-disable-next-line max-len
                            // @TODO: maybe more valid case would be redirect on some page as "no permitted routes" or such
                            this.loginService.logout();
                        }
                    });
                }
            });
    }

    public checkOtp(): void {
        const credentials = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            grant_type: 'tfa_otp_token',
            otp: this.otpValue,
            rememberMe: this.rememberMe,
        };

        this.loginService.login(credentials).then(() => {
            this.isDisabled = false;
            this.loginSuccess();
        }).catch(() => {
            this.authenticationError = true;
            this.successRegistration = false;
            this.isDisabled = false;
            this.backToLogin();
        });
    }

    public backToLogin(): void {
        this.checkOTP = false;
        this.stateStorageService.resetAllStates();
        this.password = '';
        this.rememberMe = false;
        this.username = '';
    }

    public login(): void | null {
        this.sendingLogin = true;
        this.isDisabled = true;
        this.authenticationError = false;
        this.successRegistration = false;
        this.stateStorageService.resetAllStates();
        const credentials = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            grant_type: 'password',
            username: this.username ? this.username.toLowerCase().trim() : '',
            password: this.password ? this.password.trim() : '',
            rememberMe: this.rememberMe,
        };

        this.loginService.login(credentials).then((data) => {
            this.isDisabled = false;
            this.isTermsShown = false;
            this.sendingLogin = false;
            if (data === 'otpConfirmation') {
                this.checkOTP = true;
                this.alertService.info('login.messages.otp.notification');
            } else {
                this.loginSuccess();
            }
        }).catch((err) => {
            const errObj = err.error || null;
            const termsErr = errObj && errObj.error === TERMS_ERROR;
            const termsToken = (errObj && errObj.oneTimeToken) || null;
            if (termsErr && termsToken && !this.isTermsShown) { this.pushTermsAccepting(termsToken); }
            this.authenticationError = !termsErr;
            this.successRegistration = false;
            this.isDisabled = false;
            this.sendingLogin = false;
        });
    }

    public requestResetPassword(): void {
        this.router.navigate(['/reset', 'request']);
    }

    public isFormDisabled(): boolean {
        return this.isDisabled;
    }

    private fixAutoFillFieldsChrome(): void {
        setTimeout(() => {
            try {
                const autoFilled = document.querySelectorAll('input:-webkit-autofill');
                if (autoFilled) {
                    this.floatLabel = true;
                }
            } catch (e) {
                // Empty block
            }
        }, 500);
    }

    private getConfigs(): Observable<any> {
        const ui = this.xmConfigService.getUiConfig();
        const uaa = this.xmConfigService.getPasswordConfig();
        return forkJoin([ui, uaa]);
    }

    private pushTermsAccepting(token: string): void {
        this.isTermsShown = true;
        const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.config = this.config;
        modalRef.componentInstance.termsToken = token;
        modalRef.result.then((r) => {
            if (r === 'accept') {
                this.login();
            } else {
                this.isTermsShown = false;
            }
        });
    }
}
