import { Component, OnInit } from '@angular/core';

import { Principal } from '@xm-ngx/core/user';
import { PasswordSpec } from '@xm-ngx/core/config';
import { XmConfigService } from '@xm-ngx/core/config';
import { ChangePassword } from './password.model';
import { Password } from './password.service';
import { ModulesLanguageHelper } from '@xm-ngx/translation';
import { IPasswordPolicyConfig } from '@xm-ngx/components/password-policies';

@Component({
    selector: 'xm-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

    public isShowPassword: boolean;
    public isShowNewPassword: boolean;
    public doNotMatch: string;
    public error: string;
    public success: string;
    public account: any;
    public password: ChangePassword;
    public passwordSettings: PasswordSpec;
    public patternMessage: string;
    public passwordConfig: IPasswordPolicyConfig;

    constructor(
        private passwordService: Password,
        private modulesLangHelper: ModulesLanguageHelper,
        private xmConfigService: XmConfigService,
        private principal: Principal,
    ) {
        this.password = new ChangePassword();
    }

    public ngOnInit(): void {
        this.principal.identity().then((account) => {
            this.account = account;
            this.xmConfigService
                .getPasswordConfig()
                .subscribe((config: any) => {
                    this.makePasswordSettings(config);
                }, () => this.makePasswordSettings());
        });
    }

    public getUsername(account: any): string | null {
        if (account.firstName) {
            return account.firstName + ' ' + (account.lastName ? account.lastName : '');
        }

        for (const login of account.logins) {
            if (login.login && !login.removed) {
                return login.login;
            }
        }

        return null;
    }

    public changePassword(): void {
        if (this.password.newPassword !== this.password.confirmNewPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.passwordService.save(this.password).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
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
