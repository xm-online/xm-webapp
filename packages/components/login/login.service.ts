import {Inject, Injectable, isDevMode} from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthServerProvider, Principal } from '@xm-ngx/core/user';
import { AuthRefreshTokenService, StateStorageService, XmAuthTargetUrlService } from '@xm-ngx/core/auth';
import { SessionStorageService } from 'ngx-webstorage';
import { IIdpClient, IIdpConfig, XmCoreConfig, XmEventManager, XmSessionService } from '@xm-ngx/core';
import { DOCUMENT, Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrivacyAndTermsDialogComponent } from '@xm-ngx/components/privacy-and-terms-dialog';

@Injectable()
export class LoginService {
    private readonly LOGOUT_EVENT = 'USER-LOGOUT';
    public IDP_SERVER_API_URL: string;

    constructor(private principal: Principal,
                private router: Router,
                private authRefreshTokenService: AuthRefreshTokenService,
                private authServerProvider: AuthServerProvider,
                private stateStorageService: StateStorageService,
                private xmAuthTargetUrlService: XmAuthTargetUrlService,
                private $sessionStorage: SessionStorageService,
                protected modalService: MatDialog,
                protected eventManager: XmEventManager,
                protected location: Location,
                protected sessionService: XmSessionService,
                @Inject(DOCUMENT) private document: Document,
                private xmCoreConfig: XmCoreConfig,
    ) {
        this.IDP_SERVER_API_URL = this.xmCoreConfig.IDP_SERVER_API_URL;
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
                    this.getUserIdentity(() => {
                        this.loginSuccess();
                        resolve(data);
                    }, data);
                    return cb();
                }, err => {
                    console.info(err);
                    reject(err);
                    return cb(err);
                });
        });
    }

    public onIdpDirectLogin(config: IIdpConfig, skipStoreUrl?: boolean): void {
        const client = this.getIdpClient({ idp: config?.idp } as IIdpConfig);
        const previousUrl = location.pathname + location.search + location.hash;
        if(!skipStoreUrl){
            this.stateStorageService.storeUrl(previousUrl);
        }
        this.$sessionStorage.store('idp_client', client);
        this.loginWithIdpClient(client);
    }

    public loginWithIdpClient(client: IIdpClient): void {
        const authEndpointUri = client.openIdConfig.authorizationEndpoint.uri;
        const getRedirectUrl = `oauth2/authorization/${client.key}`;
        const devApiUri = this.IDP_SERVER_API_URL;
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


        if (!this.xmCoreConfig.IS_PRODUCTION) {
            console.info('[dbg] broadcast %s', 'authenticationSuccess');
        }

        this.eventManager.broadcast({
            name: 'authenticationSuccess',
            content: 'Sending Authentication Success',
        });
        this.xmAuthTargetUrlService.initialRedirect();
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
        this.eventManager.broadcast({name: this.LOGOUT_EVENT});
        this.sessionService.clear();
        this.router.navigate(['']);
    }

    /** @deprecated use SessionService.clear() */
    public logout$(): Observable<void> {
        this.eventManager.broadcast({name: this.LOGOUT_EVENT});
        this.sessionService.clear();
        this.authRefreshTokenService.clear();
        return of(null);
    }

    private checkTokenAndForceIdentity(): void {
        /* This method forcing identity on page load when user has token but identity does not inits */
        const path = this.location.path();
        if (path.startsWith('/logout')) {
            if (isDevMode()) {
                console.info('[LoginService] skip force identity on logout route:', path);
            }
            return;
        }
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
        const defaultClientKey = this.xmCoreConfig.IDP_CLIENT_KEY ? this.xmCoreConfig.IDP_CLIENT_KEY : config?.idp?.features?.directLogin?.defaultClientKey;
        return defaultClientKey ?
            config?.idp?.clients?.filter(s => s.key === defaultClientKey).shift() :
            config?.idp?.clients[0];
    }
}
