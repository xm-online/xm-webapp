import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';
import { combineLatest } from 'rxjs';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { take } from 'rxjs/operators';
import { TERMS_ERROR } from '../../xm.constants';

const TERMS_PROP = 'privacyAndTermsEnabled';

@Component({
  selector: 'xm-idp-callback',
  templateUrl: './idp-callback.component.html',
  styleUrls: ['./idp-callback.component.scss']
})
export class IdpCallbackComponent implements OnDestroy {

    protected isTermsShown: boolean;

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
                this.loginService.loginWithIdpCallback(params).then(() => {
                    this.isTermsShown = false;
                    this.loginService.loginSuccess();
                }).catch((err) => {
                    this.handleErrorException(err, config, params);
                });
            } else {
                this.router.navigate(['']);
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private handleErrorException(err, config, params) {
        this.isTermsShown = true;
        const errObj = err.error || null;
        const termsErr = errObj && errObj.error === TERMS_ERROR;
        const termsToken = errObj.oneTimeToken || null;
        const termsConfig = this.extractTermConfigOject(config, TERMS_PROP);
        if (termsErr && termsToken && !this.isTermsShown && termsConfig[TERMS_PROP]) {
            this.loginService.showTermsDialog(termsToken, termsConfig).then((r) => {
                if (r === 'accept') {
                    this.loginService.loginWithIdpCallback(params);
                } else {
                    this.isTermsShown = false;
                }
            });
        }
    }

    private extractTermConfigOject(theObject, key) {
        let result = null;
        if(theObject instanceof Array) {
            for(let i = 0; i < theObject.length; i++) {
                result = this.extractTermConfigOject(theObject[i], key);
                if (result) {
                    break;
                }
            }
        } else {
            for(let prop in theObject) {
                if(prop == key) {
                    if(theObject[prop] == 1) {
                        return theObject;
                    }
                }
                if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    result = this.extractTermConfigOject(theObject[prop], key);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    }
}
