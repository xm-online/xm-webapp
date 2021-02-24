import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { CookieService } from 'ngx-cookie-service';

import { AuthService, LoginComponent, LoginService, XmConfigService } from '../../shared';
import { StateStorageService } from '@xm-ngx/core/auth';
import { XM_EVENT_LIST } from '../../xm.constants';
import { DOCUMENT } from '@angular/common';
import { XmUiConfigService } from '@xm-ngx/core/config';

const SOCIAL_AUTH = 'social-authentication';

@Component({
    selector: 'xm-social-auth',
    templateUrl: '../../shared/login/login.component.html',
})
export class SocialAuthComponent extends LoginComponent implements OnInit {

    constructor(
                protected eventManager: XmEventManager,
                protected xmConfigService: XmConfigService,
                protected xmUiConfigService: XmUiConfigService,
                protected loginService: LoginService,
                protected stateStorageService: StateStorageService,
                protected elementRef: ElementRef,
                protected router: Router,
                protected alertService: XmToasterService,
                protected modalService: MatDialog,
                protected authService: AuthService,
                protected cookieService: CookieService,
                @Inject(DOCUMENT) protected document: Document,) {
        super(
            eventManager,
            xmConfigService,
            xmUiConfigService,
            loginService,
            stateStorageService,
            elementRef,
            router,
            alertService,
            modalService,
            document,
        );
    }

    public ngOnInit(): void {
        const token = this.cookieService.get(SOCIAL_AUTH);
        if (token) {
            this.loginService.loginWithToken(token, false).then(() => {
                this.cookieService.delete(SOCIAL_AUTH);
                this.authService.authorize(true)
                    .then(
                        () => {
                            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_SUCCESS_AUTH});
                            this.router.navigate(['dashboard']);
                        },
                        () => this.router.navigate(['']),
                    );
            }, () => {
                this.router.navigate(['social-register'], {queryParams: {success: 'false'}});
            });
        }
    }
}
