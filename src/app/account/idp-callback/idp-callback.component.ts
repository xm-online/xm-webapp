import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';
import { combineLatest } from 'rxjs';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { take } from 'rxjs/operators';

@Component({
  selector: 'xm-idp-callback',
  templateUrl: './idp-callback.component.html',
  styleUrls: ['./idp-callback.component.scss']
})
export class IdpCallbackComponent implements OnDestroy {
    constructor(
        private loginService: LoginService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        protected xmUiConfigService: XmUiConfigService,
    ) {
        combineLatest(
            this.activeRouter.queryParams,
            this.xmUiConfigService.config$(),
        ).pipe(
            takeUntilOnDestroy(this),
            take(1),
        ).subscribe(([params, config]) => {
            if (activeRouter.snapshot.data.callbackAuth && params && config?.idp?.enabled) {
                this.loginService.loginWithIdpCallback(params);
            } else {
                this.router.navigate(['']);
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
