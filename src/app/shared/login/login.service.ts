import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JhiLanguageService } from 'ng-jhipster';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Principal } from '../auth/principal.service';
import { StateStorageService } from '../auth/state-storage.service';
import { XmEntitySpecWrapperService } from '../../xm-entity/shared/xm-entity-spec-wrapper.service';

@Injectable()
export class LoginService {

    constructor(private jhiLanguageService: JhiLanguageService,
                private principal: Principal,
                private router: Router,
                private authServerProvider: AuthServerProvider,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private stateStorageService: StateStorageService) {
    }

    public login(credentials: any, callback?: any): Promise<unknown> {

        const cb = callback || (() => undefined);

        return new Promise((resolve, reject) => {

            this.authServerProvider.login(credentials).subscribe((data) => {

                if (this.stateStorageService.getDestinationState()
                    && this.stateStorageService.getDestinationState().destination) {
                    const state = this.stateStorageService.getDestinationState().destination;
                    if (state.name && state.name === 'otpConfirmation') {
                        resolve(state.name);
                    } else {
                        this.getUserIdentity(resolve, data);
                    }
                } else {
                    this.getUserIdentity(resolve, data);
                }

                return cb();
            }, (err) => {
                console.info('service-error %o', err);
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }

    public loginWithToken(jwt: string, rememberMe: boolean): Promise<unknown> {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    public logout(): void {
        this.authServerProvider.logout().subscribe();
        this.principal.logout();
        this.router.navigate(['']);
    }

    public checkAvailableUrlsAndNavigate(): void {
        this.principal.identity().then((identity) => {
            const canSeeDash = this.principal
                .hasPrivileges(['DASHBOARD.GET_LIST', 'DASHBOARD.GET_LIST.ITEM']);
            const canSeeApps = this.principal
                .hasPrivileges(['XMENTITY.GET_LIST', 'XMENTITY.GET_LIST.ITEM']);
            Promise.all([canSeeDash, canSeeApps])
                .then((results: any[]) => {
                    const privileges = results.map((p, i) => ({index: i, value: p})).filter(p => p.value === true);
                    const currentPrivilege = privileges && privileges.length > 0 && privileges[0].index;
                    switch (currentPrivilege) {
                        case 0: {
                            this.router.navigate(['dashboard'], { replaceUrl: true });
                            break;
                        }
                        case 1: {
                            this.getAppUrlAndNavigate();
                            break;
                        }
                        default: {
                            this.router.navigate(['home'], { replaceUrl: true });
                        }
                    }
                });
        });
    }

    private getUserIdentity(next: any, data: any): void {
        this.principal.identity(true, false).then((account) => {
            /*
             * After the login the language will be changed to
             * the language selected by the user during his registration
             */
            if (account !== null && account.langKey) {
                this.jhiLanguageService.changeLanguage(account.langKey);
            }

            // In case no permissions to get account, no reason to continue with dashboards
            if (!account) {
                this.logout();
            }

            if (next) {
                next(data);
            }
        });
    }

    private getAppUrlAndNavigate(): void {
        this.principal.hasPrivileges(['XMENTITY_SPEC.GET'])
            .then((result) => {
                if (result) {
                    this.xmEntitySpecWrapperService.spec(true).then((spec) => {
                        const applications = spec.types.filter((t) => t.isApp)
                            .filter((t) => this.principal
                                .hasPrivilegesInline([`APPLICATION.${  t.key}`]));
                        if (applications.length > 0) {
                            this.router.navigate([`application/${  applications[0].key}`], { replaceUrl: true });
                        } else {
                            this.router.navigate(['home'], { replaceUrl: true });
                        }
                    });
                }
            });
    }
}
