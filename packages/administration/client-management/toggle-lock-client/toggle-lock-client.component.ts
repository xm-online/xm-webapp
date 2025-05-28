import { Component, Input } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { Client, ClientService, ClientState } from '@xm-ngx/core/client';
import { XmToasterService } from '@xm-ngx/toaster';

@Component({
    selector: 'xm-toggle-lock-client',
    templateUrl: './toggle-lock-client.component.html',
    standalone: false,
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
            title: isActivate ? 'clientManagement.actions.block' : 'clientManagement.actions.unblock',
            showCancelButton: true,
            confirmButtonText: 'clientManagement.actions.confirm',
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
