import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';

import { combineLatest } from 'rxjs';
import { LoginService } from './login.service';
import { StateStorageService } from '@xm-ngx/core/auth';
import { XmConfigService } from '@xm-ngx/core/config';
import { DOCUMENT, NgClass, NgIf } from '@angular/common';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IdpComponent } from './idp/idp.component';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FocusDirective } from '@xm-ngx/components/text';

export interface XmLoginFormUIConfig extends XmUIConfig {
    hideRememberMe: boolean;
    hideResetPasswordLink: boolean;
}

@Component({
    selector: 'xm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatInputModule,
        IdpComponent,
        MatButtonModule,
        XmTranslationModule,
        NgIf,
        MatIconModule,
        MatCheckboxModule,
        NgClass,
        FocusDirective,
    ],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

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
    public checkTermsOfConditions: boolean;
    public uiConfig: XmLoginFormUIConfig;

    constructor(
        protected eventManager: XmEventManager,
        protected xmConfigService: XmConfigService,
        protected xmUiConfigService: XmUiConfigService<XmLoginFormUIConfig>,
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.document.body.classList.add('xm-public-screen');
        this.isDisabled = false;

        combineLatest([
            this.xmUiConfigService.config$(),
            this.xmConfigService.getPasswordConfig(),
        ])
            .pipe(
                takeUntilOnDestroy(this),
                take(1),
            )
            .subscribe(([ui, uaa]) => {
                this.uiConfig = ui;
                const uaaConfig: string | any = uaa;
                this.hideRememberMe = this.uiConfig.hideRememberMe ? this.uiConfig.hideRememberMe : false;
                this.rememberMe = this.uiConfig.rememberMeActiveByDefault === true;
                this.hideResetPasswordLink = this.uiConfig.hideResetPasswordLink ? this.uiConfig.hideResetPasswordLink : false;
                this.checkTermsOfConditions = (uaaConfig && uaaConfig.isTermsOfConditionsEnabled) || false;
                if (this.uiConfig?.idp?.features?.directLogin?.enabled) {
                    this.loginService.onIdpDirectLogin(ui);
                }
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
            const errObj = err && err.error || null;
            const termsErr = errObj && errObj.error === 'needAcceptTermsOfConditions';
            const termsToken = errObj && errObj.oneTimeToken || null;
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

    private pushTermsAccepting(token: string): void {
        this.isTermsShown = true;
        this.loginService.showTermsDialog(token, this.config).then((r) => {
            if (r === 'accept') {
                this.login();
            } else {
                this.isTermsShown = false;
            }
        });
    }
}
