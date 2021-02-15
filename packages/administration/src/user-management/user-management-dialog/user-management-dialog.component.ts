import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager, XmPublicUiConfigService } from '@xm-ngx/core';
import { LanguageService } from '@xm-ngx/translation';
import { filter, take } from 'rxjs/operators';
import { User, UserService, XmConfigService } from '../../../../../src/app/shared';
import { RoleService } from '../../../../../src/app/shared/role/role.service';

import { XM_EVENT_LIST } from '../../../../../src/app/xm.constants';

@Component({
    selector: 'xm-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html',
})
export class UserMgmtDialogComponent implements OnInit {

    public user: User;
    public userRoles: string | string[] | undefined | null;
    public languages: string[];
    public authorities: string[];
    public showLoader: boolean;
    public isMultiRole: boolean = false;
    @ViewChild('userLoginForm', { static: false }) public userLoginForm: any;
    @Input() public selectedUser: User;

    constructor(
        public activeModal: MatDialogRef<UserMgmtDialogComponent>,
        private languageService: LanguageService,
        private сonfigService: XmConfigService,
        private xmConfigService: XmPublicUiConfigService,
        private userService: UserService,
        private roleService: RoleService,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedUser) {
            this.user = this.selectedUser;
        } else {
            this.user = new User();
        }

        this.сonfigService.getConfig('/uaa/uaa.yml?toJson').subscribe((result) => {
            this.isMultiRole = JSON.parse(result).multiRoleEnabled;
            if (this.isMultiRole) {
                this.userRoles = this.user.authorities;
            } else {
                this.userRoles = this.user.roleKey;
            }
        });

        this.roleService.getRoles().subscribe((roles) => {
            this.authorities = roles.map((role) => role.roleKey).sort();
        });

        this.xmConfigService.config$().pipe(
            filter(c => Boolean(c)),
            take(1),
        ).subscribe((config) => {
            const languages = this.languageService.languages;
            this.languages = (config && config.langs) ? config.langs : languages;
        });

    }

    public clear(): void {
        this.activeModal.close(false);
    }

    public save(): void {
        this.showLoader = true;
        if (!this.user.id) {
            this.userLoginForm.createLogins();
        }
        this.userService[this.user.id ? 'update' : 'create'](this.user)
            .subscribe((response) => this.onSaveSuccess(response),
                (err) => console.info(err),
                () => this.showLoader = false);
    }

    public roleSelect(role: string | string[]): void {
        if (Array.isArray(role)) {
            this.user.authorities = role;
        } else {
            this.user.roleKey = role;
        }
    }

    private onSaveSuccess(result: any): void {
        this.eventManager.broadcast({ name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK' });
        this.activeModal.close(result);
    }

}
