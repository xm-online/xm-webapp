import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';

import { ReCaptchaComponent, ReCaptchaModule } from 'angular2-recaptcha';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordSpec } from '@xm-ngx/core/config';
import { PrivacyAndTermsDialogComponent } from '@xm-ngx/components/privacy-and-terms-dialog';
import { XmConfigService } from '@xm-ngx/core/config';
import { RegisterService } from './register.service';
import { ModulesLanguageHelper, XmTranslationModule } from '@xm-ngx/translation';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar';
import { FocusDirective } from '@xm-ngx/components/text';
import { PasswordPoliciesComponent } from '@xm-ngx/components/password-policies/password-policies.component';

@Component({
    selector: 'xm-register',
    styles: ['form button, [type="submit"], .btn .btn-primary { width: 100%; padding: 8px 24px;}'],
    templateUrl: './register.component.html',
    standalone: true,
    imports: [
        XmTranslationModule,
        MatInputModule,
        MatButtonModule,
        NgIf,
        FormsModule,
        ReCaptchaModule,
        PasswordStrengthBarComponent,
        FocusDirective,
        PasswordPoliciesComponent,
    ],
    providers: [RegisterService],
})
export class RegisterComponent implements OnInit {

    @Input() public config: any;
    @ViewChild(ReCaptchaComponent, {static: false}) public captcha: ReCaptchaComponent;

    public email: string;
    public msisdn: string;
    public nickname: string;
    public confirmPassword: string;
    public doNotMatch: string;
    public error: string;
    public errorEmailEmpty: string;
    public errorUserExists: string;
    public captchaRequired: string;
    public registerAccount: any;
    public success: boolean;
    public modalRef: MatDialogRef<any>;
    public needCaptcha: boolean = false;
    public language: string = 'en';
    public publicKey: string;
    public passwordSettings: PasswordSpec;
    public patternMessage: string;
    public passwordConfig: any;

    constructor(private jhiLanguageService: JhiLanguageService,
                private xmConfigService: XmConfigService,
                private registerService: RegisterService,
                private modulesLangHelper: ModulesLanguageHelper,
                private eventManager: XmEventManager,
                private modalService: MatDialog) {

        this.jhiLanguageService.getCurrent().then((lang) => {
            this.language = lang;
        });

        this.registerService.isCaptchaNeed().subscribe((result) => {
            this.needCaptcha = result.isCaptchaNeed;
            this.publicKey = result.publicKey;
        });
    }

    public ngOnInit(): void {
        this.success = false;
        this.registerAccount = {};
        this.xmConfigService
            .getPasswordConfig()
            .subscribe((config: any) => {
                this.makePasswordSettings(config);
            }, () => this.makePasswordSettings());
    }

    public register(): void {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            if (this.config && this.config.privacyAndTermsEnabled) {
                const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, {
                    width: '500px',
                });
                modalRef.componentInstance.config = this.config;
                modalRef.afterClosed().subscribe((r) => {
                    if (r === 'accept') {
                        this.registration();
                    }
                });
            } else {
                this.registration();
            }
        }
    }

    public handleCorrectCaptcha($event: any): void {
        this.registerAccount.captcha = $event;
        this.captchaRequired = null;
    }

    public handleCaptchaExpired(_$event: any): void {
        this.registerAccount.captcha = null;
    }

    private registration(): void {
        this.doNotMatch = null;
        this.error = null;
        this.errorUserExists = null;
        this.errorEmailEmpty = null;
        this.captchaRequired = null;
        this.jhiLanguageService.getCurrent().then((key) => {
            this.registerAccount.langKey = key;
            this.makeLogins();
            this.registerService.save(this.registerAccount).subscribe(() => {
                this.success = true;
                this.eventManager.broadcast({name: 'xmRegistration', content: ''});
            },
            (response) => this.processError(response));
        });
    }

    private processError(response: any): void {
        this.success = null;
        if (response.status === 400 && response.error.error === 'error.login.already.used') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.error === 'error.captcha.required') {
            this.captchaRequired = 'ERROR';
            this.needCaptcha = true;
            this.registerService.isCaptchaNeed().subscribe((result) => {
                this.publicKey = result.publicKey;
            });
        } else {
            this.error = 'ERROR';
        }
        if (this.captcha) {
            this.captcha.reset();
        }
    }

    private makeLogins(): void {
        this.registerAccount.logins = [];

        // email login
        this.registerAccount.logins.push({
            typeKey: 'LOGIN.EMAIL',
            login: this.email,
        });

        // nickname login
        if (this.nickname) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.NICKNAME',
                login: this.nickname,
            });
        }

        // phone number login
        if (this.msisdn) {
            this.registerAccount.logins.push({
                typeKey: 'LOGIN.MSISDN',
                login: this.msisdn,
            });
        }
    }

    private makePasswordSettings(config?: any): void {
        this.passwordConfig = config;
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.updatePatternMessage(this.passwordSettings.patternMessage);
        }
    }

    public updatePatternMessage(message: any, currentLang?: string): string {
        const lang = currentLang ? currentLang : this.modulesLangHelper.getLangKey();
        return message[lang] || message;
    }
}
