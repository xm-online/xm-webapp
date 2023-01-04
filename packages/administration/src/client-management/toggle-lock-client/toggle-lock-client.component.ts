import { Component, Input } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { Client, ClientService, ClientState } from '../../../../../src/app/shared';

@Component({
    selector: 'xm-toggle-lock-client',
    templateUrl: './toggle-lock-client.component.html',
})
export class ToggleLockClientComponent {
    public ClientState: typeof ClientState = ClientState;
    @Input() public client: Client;

    constructor(
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
        private clientService: ClientService,
    ) {
    }

    public changeState(client: Client): void {
        const isActivate = client.clientState != ClientState.BLOCKED;
        this.alertService.open({
            title: isActivate ? 'Block client?' : 'Unblock client?',
            showCancelButton: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'Yes',
        }).subscribe((result) => result.value ?
            this.changeUserState(client) :
            console.info('Cancel'));
    }


    private changeUserState(client: Client): void {
        const isActivate = client.clientState != ClientState.BLOCKED;
        const unblock$ = this.clientService.unblock(client);
        const block$ = this.clientService.block(client);
        const api = isActivate ? block$ : unblock$;

        api.subscribe(() => {
            client.clientState = isActivate ? ClientState.BLOCKED : ClientState.ACTIVE;
            this.toasterService.success('userManagement.success');
        }, () => {
            this.toasterService.error('userManagement.error');
        });
    }

}
