import { Component, Inject, Input, Optional } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { TABLE_ROW } from '@xm-ngx/dynamic';
import { XmToasterService } from '@xm-ngx/toaster';
import { User, UserService } from '../../../../../src/app/shared';

@Component({
    selector: 'xm-unblock-lock-user',
    templateUrl: './unblock-lock-user.component.html',
    styleUrls: ['./unblock-lock-user.component.scss'],
})
export class UnblockLockUserComponent {
    @Input() public user: User;

    constructor(
        protected alertService: XmAlertService,
        protected toasterService: XmToasterService,
        private userService: UserService,
        @Optional() @Inject(TABLE_ROW) row: User,
    ) {
        this.user = row;
    }

    public changeState(user: User): void {
        this.alertService.open({
            title: user.activated ? `Block user?` : `Unblock user?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes',
        }).subscribe((result) => result.value ?
            this.changeUserState(user) :
            console.info('Cancel'));
    }


    private changeUserState(user: User): void {
        const isActivate = user.activated;
        const unblock$ = this.userService.unblock(user);
        const block$ = this.userService.block(user);
        const api = isActivate ? block$: unblock$;

        api.subscribe(() => {
            user.activated = !isActivate;
            this.toasterService.success('userManagement.success');
        }, () => {
            this.toasterService.error('userManagement.error');
        });
    }

}
