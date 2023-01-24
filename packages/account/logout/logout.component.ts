import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { SessionStorageService } from 'ngx-webstorage';
import { combineLatest } from 'rxjs';
import { IIdpClient } from '../../core/src/xm-public-idp-config-model';

import { LoginService } from '@xm-ngx/core/auth';
import { IDP_CLIENT } from '../../../src/app/xm.constants';

@Component({
    selector: 'xm-logout',
    templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit, OnDestroy {

    constructor(
        protected readonly loginService: LoginService,
        protected readonly xmEntitySpecWrapperService: XmEntitySpecWrapperService,
        protected readonly translateService: TranslateService,
        protected xmUiConfigService: XmUiConfigService,
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
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'global.common.yes-exit',
            cancelButtonText: 'global.common.cancel',
        }).subscribe((result) => result.value ? this.logout() : history.back());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public logout(): void {
        const idpClient: IIdpClient = this.$sessionStorage.retrieve(IDP_CLIENT);
        const idpLogoutUri = idpClient?.openIdConfig?.endSessionEndpoint?.uri;
        combineLatest(
            this.loginService.logout$(),
            this.xmUiConfigService.config$(),
        )
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe(([logout, config]) => {
                if (idpLogoutUri && config?.idp?.enabled && idpClient) {
                    location.href = idpLogoutUri;
                } else {
                    this.router.navigate(['']);
                }
            });
    }
}
