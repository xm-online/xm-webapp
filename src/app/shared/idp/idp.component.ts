import { Component, EventEmitter, Output } from '@angular/core';
import { IIdpClient, IIdpConfig } from '../spec';
import { XmConfigService } from '../spec/config.service';

@Component({
  selector: 'xm-idp',
  templateUrl: './idp.component.html',
  styleUrls: ['./idp.component.scss']
})
export class IdpComponent {

    public config: IIdpConfig;
    public clients: IIdpClient[];
    @Output() public onClientClicked: EventEmitter<IIdpClient> = new EventEmitter<IIdpClient>();

    constructor(protected xmConfigService: XmConfigService) {
        this.xmConfigService.getIdpConfig().subscribe((config: IIdpConfig) => {
            this.config = config;
            this.clients = this.config?.clients || [];
        });
    }


    public onLogin(client: IIdpClient): void {
        this.onClientClicked.emit(client);
    }

}
