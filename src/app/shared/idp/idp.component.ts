import { Component, OnDestroy } from '@angular/core';
import { IIdpClient, IIdpConfig } from '../../../../packages/core/src/xm-public-idp-config-model';
import { XmPublicIdpConfigService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Location } from '@angular/common';
import { LoginService } from '@xm-ngx/core/auth';

@Component({
    selector: 'xm-idp',
    templateUrl: './idp.component.html',
    styleUrls: ['./idp.component.scss'],
})
export class IdpComponent implements OnDestroy {

    public config: IIdpConfig;
    public clients: IIdpClient[];

    constructor(
        protected location: Location,
        protected xmConfigService: XmPublicIdpConfigService,
        protected loginService: LoginService,
    ) {
        this.xmConfigService.config$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((cfg: IIdpConfig) => {
                this.config = cfg;
                this.clients = this.config?.idp?.clients || [];
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public onLogin(client: IIdpClient): void {
        this.loginService.loginWithIdpClient(client);
    }
}
