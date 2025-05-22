import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';
// import { XM_EVENT_LIST } from '../../../src/app/xm.constants';
import { User, UserService } from '@xm-ngx/core/user';

@Component({
    selector: 'xm-user-mgmt-delete-dialog',
    templateUrl: './user-management-delete-dialog.component.html',
    standalone: false,
})
export class UserMgmtDeleteDialogComponent {

    public showLoader: boolean;
    public login: string;

    constructor(
        private userService: UserService,
        public activeModal: MatDialogRef<UserMgmtDeleteDialogComponent>,
        private eventManager: XmEventManager,
    ) {
    }

    private _user: User;

    public get user(): User {
        return this._user;
    }

    @Input()
    public set user(user: User) {
        this._user = user;
        this.login = this.getLogin(this._user);
    }

    public clear(): void {
        this.activeModal.close(false);
    }

    public confirmDelete(userKey: string): void {
        this.showLoader = true;
        this.userService.delete(userKey).subscribe(
            () => {
                this.eventManager.broadcast({
                    name: 'userListModification',
                    content: {id: 'delete', msg: 'Deleted a user'},
                });
                this.activeModal.close(true);
                this.eventManager.broadcast({name: 'userListModification', content: 'OK'});
            },
            (err) => console.info(err),
            () => this.showLoader = false);
    }

    private getLogin(user: User): string {
        return user?.logins?.find(login => login.typeKey === 'LOGIN.NICKNAME')?.login;
    }
}
