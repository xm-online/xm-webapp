import { Component, Input, OnChanges, Optional, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';

import { AccountService, Principal, User, UserService } from '@xm-ngx/core/user';
import { UserLoginService } from './user-login.service';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatCardModule } from '@angular/material/card';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-user-login-form',
    templateUrl: './user-login-form.component.html',
    standalone: true,
    imports: [CommonModule, XmTranslationModule, MatCardModule, XmPermissionModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class UserLoginFormComponent implements OnChanges {

    @Input()
    public isUser: boolean = false;
    @Input()
    public isCreate: boolean = false;
    public isSaving: boolean;
    public userLogins: any = [];
    public success: boolean;
    @Input()
    public user: User;
    private _editForm: NgForm;
    public get editForm(): NgForm {
        return this._editForm;
    }
    @ViewChild('editForm') public set editForm(editForm: NgForm) {
        this._editForm = editForm;
        editForm.form.setValidators([() => this.isSubmitValid() ? null : { logins: true }]);
    }

    constructor(@Optional() private activeModal: MatDialogRef<UserLoginFormComponent>,
                private userService: UserService,
                private accountService: AccountService,
                private principal: Principal,
                private eventManager: XmEventManager,
                private userLoginService: UserLoginService) {
    }

    public ngOnChanges(): void {
        this.reload();
    }

    public isSubmitValid(): boolean {
        for (const key in this.editForm.value) {
            if (this.editForm.value[key]) {
                return true;
            }
        }
        return false;
    }

    public clear(): void {
        if (this.isUser && !this.isCreate) {
            this.activeModal.close(false);
        }
    }

    public save(): void {
        if (this.isCreate) {
            return;
        }
        this.isSaving = true;
        this.createLogins();
        if (this.isUser) {
            this.userService.updateLogins(this.user).subscribe((response) => this.onSaveSuccess(response),
                () => this.onSaveError());
        } else {
            this.accountService.updateLogins(this.user).subscribe((response) => this.onSaveSuccess(response),
                () => this.onSaveError());
        }
    }

    public createLogins(): void {
        this.user.logins = [];
        this.userLogins.filter((login) => login.value).forEach((login) => {
            this.user.logins.push({
                id: login.id,
                typeKey: login.key,
                stateKey: null,
                login: login.value,
                removed: false,
            });
        });
    }

    private reload(): void {
        this.isSaving = false;
        this.userLogins = [];

        this.userLoginService.getAllLogins().then((allLogins) => {
            Object.keys(allLogins).forEach((typeKey) => {
                this.userLogins.push({ key: typeKey, name: this.userLoginService.getName(typeKey) });
            });
            if (this.user.logins) {
                this.user.logins.forEach((login) => {
                    const info = this.userLogins.find((i) => i.key === login.typeKey);
                    if (info) {
                        info.value = login.login;
                        info.id = login.id;
                    }
                });
            }
        });
    }

    private onSaveSuccess(result: any): void {
        this.isSaving = false;
        this.success = true;
        if (this.isUser) {
            this.eventManager.broadcast({ name: 'userListModification', content: 'OK' });
            this.activeModal.close(result);
        } else {
            this.principal.identity(true).then((account) => {
                this.user = account;
                this.reload();
            });
        }
    }

    private onSaveError(): void {
        this.isSaving = false;
        this.success = false;
    }

}
