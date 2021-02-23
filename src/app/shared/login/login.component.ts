import { AfterViewInit, Component, ElementRef, Inject, Input, isDevMode, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDP_CLIENT, TERMS_ERROR } from '../../xm.constants';
import { LoginService } from '../auth/login.service';
import { StateStorageService } from '../auth/state-storage.service';
import { PrivacyAndTermsDialogComponent } from '../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfigService } from '../spec/config.service';
import { IIdpClient } from '../spec';
import { SessionStorageService } from 'ngx-webstorage';
import { DOCUMENT, Location } from '@angular/common';

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
    public showIdp: boolean = false;

    constructor(
        protected $sessionStorage: SessionStorageService,
        protected location: Location,
        protected eventManager: XmEventManager,
        protected xmConfigService: XmConfigService,
        protected loginService: LoginService,
        protected stateStorageService: StateStorageService,
        protected elementRef: ElementRef,
        protected router: Router,
        protected alertService: XmToasterService,
        protected modalService: MatDialog,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        this.checkOTP = false;
        this.credentials = {};
        this.otpValue = '';
        this.successRegistration = false;
    }

    public ngOnInit(): void {
        this.document.body.classList.add('xm-public-screen');
        this.isDisabled = false;
        this.getConfigs()
            .pipe(
                map((c) => ({ ui: c[0], uaa: c[1] ? c[1] : null})),
            )
            .subscribe((config) => {
                const uiConfig = config && config.ui;
                const uaaConfig = config && config.uaa;
                this.showIdp = config?.ui?.idp?.enabled;
                this.socialConfig = uiConfig && uiConfig.social;
                this.hideRememberMe = uiConfig.hideRememberMe ? uiConfig.hideRememberMe : false;
                this.rememberMe = uiConfig.rememberMeActiveByDefault === true;
                this.hideResetPasswordLink = uiConfig.hideResetPasswordLink ? uiConfig.hideResetPasswordLink : false;
                this.checkTermsOfConditions = (uaaConfig && uaaConfig.isTermsOfConditionsEnabled) || false;
            });
    }

    public loginWithIdp(client: IIdpClient): void {
        const redirectUri = client.openIdConfig.authorizationEndpoint.uri;
        const getRedirectUrl = `oauth2/authorization/${client.key}`;
        const loc = isDevMode() ? 'https://ssp-dev.cloud.ticino.com' : location.origin; // todo: another way for backend uri
        this.$sessionStorage.store(IDP_CLIENT, client)
        if (redirectUri) {
            location.href = `${loc}${this.location.prepareExternalUrl(getRedirectUrl)}`;
        }
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

    public checkOtp(): void {
        const credentials = {
            grant_type: 'tfa_otp_token',
            otp: this.otpValue,
            rememberMe: this.rememberMe,
        };

        this.loginService.login(credentials).then(() => {
            this.isDisabled = false;
            this.loginService.loginSuccess();
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
                this.loginService.loginSuccess();
            }
        }).catch((err) => {
            const errObj = err.error || null;
            const termsErr = errObj && errObj.error === TERMS_ERROR;
            const termsToken = errObj.oneTimeToken || null;
            if (termsErr && termsToken && !this.isTermsShown) {
                this.pushTermsAccepting(termsToken);
            }
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
        const TERMS_MODAL_CFG: MatDialogConfig = { width: '800px', disableClose: true, autoFocus: false };
        this.isTermsShown = true;
        const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, TERMS_MODAL_CFG);
        modalRef.componentInstance.config = this.config;
        modalRef.componentInstance.termsToken = token;
        modalRef.afterClosed().subscribe((r) => {
            if (r === 'accept') {
                this.login();
            } else {
                this.isTermsShown = false;
            }
        });
    }
}
