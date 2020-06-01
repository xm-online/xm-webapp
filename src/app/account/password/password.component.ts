import {Component, OnInit, ViewChild} from '@angular/core';

import { Principal } from '../../shared';
import { XmConfigService } from '../../shared/spec/config.service';
import { PasswordSpec } from '../../xm-entity/shared/password-spec.model';
import { ChangePassword } from './password.model';
import { Password } from './password.service';
import { NgModel } from '@angular/forms';

@Component({
    selector: 'xm-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

    @ViewChild('passwordInput', {static: false}) private passwordInput: NgModel;
    @ViewChild('confirmPasswordInput', {static: false}) private confirmPasswordInput: NgModel;

    public isShowPassword: boolean;
    public isShowNewPassword: boolean;
    public doNotMatch: string;
    public error: string;
    public success: string;
    public account: any;
    public password: ChangePassword;
    public passwordSettings: PasswordSpec;
    public patternMessage: string;

    constructor(
        private passwordService: Password,
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

    public changePassword(): void {
        if (this.password.newPassword !== this.password.confirmNewPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else if (!this.confirmPasswordInput.valid || !this.passwordInput.valid) {
            this.error = null;
            this.success = null;
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
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage);
        }
    }
}
