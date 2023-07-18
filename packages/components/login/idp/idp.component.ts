import { Component, OnDestroy } from '@angular/core';
import { IIdpClient, IIdpConfig } from '@xm-ngx/core';
import { XmPublicIdpConfigService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { LoginService } from '../login.service';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslationModule } from '@xm-ngx/translation';

@Component({
    selector: 'xm-idp',
    templateUrl: './idp.component.html',
    styleUrls: ['./idp.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        XmTranslationModule,
        NgForOf,
        NgClass,
        NgIf,
    ],
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
