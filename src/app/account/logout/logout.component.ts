import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';

import { LoginService } from '../../shared';
import { SessionStorageService } from 'ngx-webstorage';
import { IDP_CLIENT } from '../../xm.constants';
import { IIdpClient } from '../../../../packages/core/src/xm-public-idp-config-model';

@Component({
    selector: 'xm-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

    constructor(
        protected readonly loginService: LoginService,
        protected readonly xmEntitySpecWrapperService: XmEntitySpecWrapperService,
        protected readonly translateService: TranslateService,
        private alertService: XmAlertService,
        private $sessionStorage: SessionStorageService,
        protected readonly route: ActivatedRoute,
        protected readonly router: Router,
    ) {
    }

    public ngOnInit(): void {
        const isForce = this.route.snapshot.paramMap.get('force');

        if (isForce) {
            this.logout();
        }

        this.alertService.open({
            title: 'global.common.are-you-sure',
            showCancelButton: true,
            buttonsStyling: false,
            showCloseButton: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'global.common.yes-exit',
            cancelButtonText: 'global.common.cancel',
        }).subscribe((result) => result.value ? this.logout() : history.back());
    }

    public logout(): void {
        const idpClient: IIdpClient = this.$sessionStorage.retrieve(IDP_CLIENT);
        const idpLogoutUri = idpClient?.openIdConfig?.endSessionEndpoint?.uri;
        this.loginService.logout$().subscribe(() => {
            if (idpLogoutUri) {
                location.href = idpLogoutUri;
            } else {
                this.router.navigate(['']);
            }
        });
    }

}
