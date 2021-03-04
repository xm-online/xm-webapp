import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { take } from 'rxjs/operators';
import { IIdpClient } from '../../../../packages/core/src/xm-public-idp-config-model';
import { LoginService } from '@xm-ngx/core/auth';

@Component({
    selector: 'xm-login-error',
    templateUrl: './login-error.component.html',
})
export class LoginErrorComponent implements OnDestroy {

    public errorKey: string;

    constructor(
        protected route: ActivatedRoute,
        protected xmUiConfigService: XmUiConfigService,
        protected loginService: LoginService,
    ) {
        combineLatest(
            this.route.params,
            this.xmUiConfigService.config$(),
        )
            .pipe(
                takeUntilOnDestroy(this),
                take(1),
            )
            .subscribe(([params, config]) => {
                if (params?.idpKey && config?.idp?.enabled) {
                    this.onLoginIdp(config?.idp?.clients?.filter((c: IIdpClient) => c.key === params?.idpKey)?.shift());
                } else {
                    this.errorKey = 'error.invalid_credentials';
                }
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private onLoginIdp(client: IIdpClient): void {
        if (client) {
            // this.loginService.loginWithIdpClient(client);
            console.warn(client);
        } else {
            this.errorKey = 'login.messages.idp.wrong-key';
        }
    }
}
