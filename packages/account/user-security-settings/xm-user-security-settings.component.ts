import { Component, OnInit } from '@angular/core';
import { XmUser } from '@xm-ngx/core/user';
import * as _ from 'lodash';
import { AccountService, Principal } from '@xm-ngx/core/user';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'xm-user-security-settings',
    templateUrl: './xm-user-security-settings.component.html',
    imports: [CommonModule, MatCardModule, XmTranslationModule, XmPermissionModule, MatCheckboxModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    standalone: true,
})
export class XmUserSecuritySettingsComponent implements OnInit {

    public tfaEnabled: boolean;
    public settingsAccount: XmUser;
    public securityChanged: boolean;
    public autoLogoutEnabled: boolean;
    public autoLogoutTime: number;

    constructor(
        private accountService: AccountService,
        private principal: Principal,
    ) {
    }

    public ngOnInit(): void {
        this.principal.identity().then((account) => {
            if (!account) {
                return;
            }

            this.settingsAccount = _.cloneDeep(account);
            this.tfaEnabled = this.settingsAccount.tfaEnabled;
            this.autoLogoutTime = this.settingsAccount.autoLogoutTime;
            this.autoLogoutEnabled = this.settingsAccount.autoLogoutEnabled;
            this.securityChanged = false;
        });
    }

    public updateSecuritySettings(): void {
        // LOGIN.EMAIL
        if (this.tfaEnabled) {
            this.accountService.enableTFA('email', this.findEmail(this.settingsAccount)).subscribe(() => {
                this.securityChanged = true;
                this.updatePrincipalIdentityBC();
            });
        } else {
            this.accountService.disableTFA().subscribe(() => {
                this.securityChanged = true;
                this.updatePrincipalIdentityBC();
            });
        }
    }

    private findEmail(account: XmUser): string {
        if (account && account.logins) {
            for (const entry of account.logins) {
                if (entry.typeKey === 'LOGIN.EMAIL') {
                    return entry.login;
                }
            }
        }
        return '';
    }

    /**
     * Backward compatibility
     */
    private updatePrincipalIdentityBC(): void {
        this.principal.identity(true).then((account) => {
            this.settingsAccount = _.cloneDeep(account);
        });
    }

}
