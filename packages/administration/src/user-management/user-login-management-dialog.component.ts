import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { User } from '@xm-ngx/core/user';

@Component({
    selector: 'xm-user-login-mgmt-dialog',
    templateUrl: './user-login-management-dialog.component.html',
})
export class UserLoginMgmtDialogComponent {

    @Input() public user: User;

    constructor(public activeModal: MatDialogRef<UserLoginMgmtDialogComponent>) {}

    public close(): void {
        this.activeModal.close();
    }
}
