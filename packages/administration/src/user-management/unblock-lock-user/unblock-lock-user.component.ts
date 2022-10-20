import { Component, Inject, Input, Optional } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { XmToasterService } from '@xm-ngx/toaster';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import { defaultsDeep } from 'lodash';
import { User, UserService } from '../../../../../src/app/shared';

export interface UnblockLockUserOptions {
    title?: Translate;
    blockUserMessage?: string;
    unBlockUserMessage?: string;
}

const DEFAULT_OPTIONS = {
    title: null,
};

@Component({
    selector: 'xm-unblock-lock-user',
    templateUrl: './unblock-lock-user.component.html',
})
export class UnblockLockUserComponent {
    public get options(): UnblockLockUserOptions {
        return this._options;
    }

    @Input()
    public set options(value: UnblockLockUserOptions) {
        this._options = defaultsDeep(value, DEFAULT_OPTIONS);
    }

    @Input() public user: User;
    private _options: UnblockLockUserOptions = DEFAULT_OPTIONS;

    constructor(
        protected alertService: XmAlertService,
        protected toasterService: XmToasterService,
        private userService: UserService,
        private xmTranslationService: XmTranslateService,
        @Optional() @Inject(XM_DYNAMIC_TABLE_ROW) row: User,
    ) {
        this.user = row;
    }

    public changeState(user: User): void {
        this.alertService.open({
            title: user.activated
                ? this.xmTranslationService.translate(this.options.blockUserMessage || 'Block user?')
                : this.xmTranslationService.translate(this.options.unBlockUserMessage || 'Unblock user?'),
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: this.xmTranslationService.translate('global.common.yes'),
        }).subscribe((result) => result.value ?
            this.changeUserState(user) :
            console.info('Cancel'));
    }


    private changeUserState(user: User): void {
        const isActivate = user.activated;
        const unblock$ = this.userService.unblock(user);
        const block$ = this.userService.block(user);
        const api = isActivate ? block$ : unblock$;

        api.subscribe(() => {
            user.activated = !isActivate;
            this.toasterService.success('userManagement.success');
        }, () => {
            this.toasterService.error('userManagement.error');
        });
    }

}
