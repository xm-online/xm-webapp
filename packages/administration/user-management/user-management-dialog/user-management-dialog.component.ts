import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// import { XM_EVENT_LIST } from '../../../../src/app/xm.constants';
import { XmLanguageUiConfig } from '@xm-ngx/administration/translations';
import { XmEventManager, XmPublicUiConfigService } from '@xm-ngx/core';
import { XmConfigService } from '@xm-ngx/core/config';
import { Role, RoleService } from '@xm-ngx/core/role';
import { User, UserService } from '@xm-ngx/core/user';
import { LanguageService } from '@xm-ngx/translation';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'xm-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html',
    standalone: false,
})
export class UserMgmtDialogComponent implements OnInit {

    public user: User;
    public userRoles: string | string[] | undefined | null;
    public languages: string[];
    public authorities: string[];
    public authoritiesMap: Record<string, Role> = {};
    public showLoader: boolean;
    public isMultiRole: boolean = false;
    @ViewChild('userLoginForm', {static: false}) public userLoginForm: any;
    @Input() public selectedUser: User;

    constructor(
        public activeModal: MatDialogRef<UserMgmtDialogComponent>,
        private languageService: LanguageService,
        private configService: XmConfigService,
        private xmConfigService: XmPublicUiConfigService<XmLanguageUiConfig>,
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

        this.configService.getConfig('/uaa/uaa.yml?toJson').subscribe((result) => {
            this.isMultiRole = JSON.parse(result).security.multiRoleEnabled;
            if (this.isMultiRole) {
                this.userRoles = this.user.authorities;
            } else {
                this.userRoles = this.user.roleKey;
            }
        });

        this.roleService.getRoles().subscribe((roles) => {
            this.authorities = roles.map((role) => role.roleKey).sort();
            this.authoritiesMap = Object.fromEntries(roles.map(it => [it.roleKey, it]));
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
            this.user.roleKey = role[0];
        } else {
            this.user.roleKey = role;
        }
    }

    private onSaveSuccess(result: any): void {
        this.eventManager.broadcast({name: 'userListModification', content: 'OK'});
        this.activeModal.close(result);
    }

}
