import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthServerProvider } from '@xm-ngx/core/user';
import { Principal } from '@xm-ngx/core/user';
import { StateStorageService } from '@xm-ngx/core/auth';
import { SessionStorageService } from 'ngx-webstorage';
import { IIdpClient, IIdpConfig, XmEventManager, XmSessionService } from '@xm-ngx/core';
import { DOCUMENT, Location } from '@angular/common';
import { environment } from '@xm-ngx/core/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrivacyAndTermsDialogComponent } from '@xm-ngx/components/privacy-and-terms-dialog';
import { AuthRefreshTokenService } from '@xm-ngx/core/auth';

@Injectable()
export class LoginService {

    constructor(private principal: Principal,
                private router: Router,
                private authRefreshTokenService: AuthRefreshTokenService,
                private authServerProvider: AuthServerProvider,
                private stateStorageService: StateStorageService,
                private $sessionStorage: SessionStorageService,
                protected modalService: MatDialog,
                protected eventManager: XmEventManager,
                protected location: Location,
                protected sessionService: XmSessionService,
                @Inject(DOCUMENT) private document: Document,
    ) {
    }

    public init(): void {
        this.checkTokenAndForceIdentity();
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

    public loginWithIdpCallback(opt: Params, callback?: any): Promise<unknown> {
        const cb = callback || (() => undefined);
        return new Promise((resolve, reject) => {
            this.authServerProvider
                .loginIdp(opt)
                .subscribe((data) => {
                    this.getUserIdentity(resolve, data);
                    return cb();
                }, err => {
                    console.info(err);
                    reject(err);
                    return cb(err);
                });
        });
    }

    public onIdpDirectLogin(config: IIdpConfig): void {
        const client = this.getIdpClient({ idp: config?.idp } as IIdpConfig);
        this.$sessionStorage.store('idp_client', client);
        this.loginWithIdpClient(client);
    }

    public loginWithIdpClient(client: IIdpClient): void {
        const authEndpointUri = client.openIdConfig.authorizationEndpoint.uri;
        const getRedirectUrl = `oauth2/authorization/${client.key}`;
        const devApiUri = environment.idpServerApiUrl;
        const loc = devApiUri ? devApiUri : location.origin;
        this.$sessionStorage.store('idp_client', client);
        if (authEndpointUri) {
            location.href = `${loc}${this.location.prepareExternalUrl(getRedirectUrl)}`;
        }
    }

    public loginWithToken(jwt: string, rememberMe: boolean): Promise<unknown> {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    public loginSuccess(): void {
        this.document.body.classList.remove('xm-public-screen');
        if (this.router.url === '/register'
            || ((/activate/).test(this.router.url))
            || this.router.url === '/finishReset'
            || this.router.url === '/requestReset') {
            this.router.navigate(['']);
        }


        if (!environment?.production) {
            console.info('[dbg] broadcast %s', 'authenticationSuccess');
        }

        this.eventManager.broadcast({
            name: 'authenticationSuccess',
            content: 'Sending Authentication Success',
        });

        /*
         * PreviousState was set in the authExpiredInterceptor before being redirected to login modal.
         * since login is succesful, go to stored previousState and clear previousState
         */
        const redirect = this.stateStorageService.getUrl();
        if (redirect) {
            this.router.navigateByUrl(redirect);
        } else {
            this.router.navigate(['dashboard']);
        }
    }

    public showTermsDialog(token: string, config: unknown): Promise<string> {
        const TERMS_MODAL_CFG: MatDialogConfig = { width: '800px', disableClose: true, autoFocus: false };
        const modalRef = this.modalService.open(PrivacyAndTermsDialogComponent, TERMS_MODAL_CFG);
        modalRef.componentInstance.config = config;
        modalRef.componentInstance.termsToken = token;
        return modalRef.afterClosed().toPromise();
    }

    /** @deprecated use SessionService.clear() */
    public logout(): void {
        this.principal.logout();
        this.authRefreshTokenService.clear();
        this.sessionService.clear();
        this.router.navigate(['']);
    }

    /** @deprecated use SessionService.clear() */
    public logout$(): Observable<void> {
        this.sessionService.clear();
        return of(null);
    }

    private checkTokenAndForceIdentity(): void {
        /* This method forcing identity on page load when user has token but identity does not inits */
        if (!this.authRefreshTokenService.isExpired()) {
            this.principal.identity();
        }
    }

    private getUserIdentity(next: any, data: any): void {
        this.principal.identity(true, true).then((account) => {
            if (next) {
                next(data);
            }
        });
    }

    private getIdpClient(config: IIdpConfig): IIdpClient {
        const defaultClientKey = environment.idpClientKey ? environment.idpClientKey : config?.idp?.features?.directLogin?.defaultClientKey;
        return defaultClientKey ?
            config?.idp?.clients?.filter(s => s.key === defaultClientKey).shift() :
            config?.idp?.clients[0];
    }
}
