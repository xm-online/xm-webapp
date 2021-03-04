import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthServerProvider } from './auth-jwt.service';
import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';
import { SessionStorageService } from 'ngx-webstorage';
import { IDP_CLIENT, XM_EVENT_LIST } from '../../xm.constants';
import { XmEventManager } from '@xm-ngx/core';
import { DOCUMENT, Location } from '@angular/common';
import { IIdpClient, IIdpConfig } from '../../../../packages/core/src/xm-public-idp-config-model';
import { environment } from '@xm-ngx/core/environment';

@Injectable()
export class LoginService {

    constructor(private principal: Principal,
                private router: Router,
                private authServerProvider: AuthServerProvider,
                private stateStorageService: StateStorageService,
                private $sessionStorage: SessionStorageService,
                protected eventManager: XmEventManager,
                protected location: Location,
                @Inject(DOCUMENT) private document: Document,
    ) {}

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

    public loginWithIdpCallback(opt: Params): void {
        this.authServerProvider
            .loginIdp(opt)
            .subscribe((data) => {
                this.getUserIdentity(null, data);
                this.loginSuccess();
            }, err => console.info(err));

    }

    public onIdpDirectLogin(config: IIdpConfig): void {
        const client = this.getIdpClient({idp: config?.idp} as IIdpConfig);
        this.$sessionStorage.store(IDP_CLIENT, client);
        this.loginWithIdpClient(client);
    }

    public loginWithIdpClient(client: IIdpClient): void {
        const redirectUri = client.openIdConfig.authorizationEndpoint.uri;
        const getRedirectUrl = `oauth2/authorization/${client.key}`;
        const devApiUri = environment.idpServerApiUrl;
        const loc = devApiUri ? devApiUri : location.origin;
        this.$sessionStorage.store(IDP_CLIENT, client);
        if (redirectUri) {
            location.href = `${loc}${this.location.prepareExternalUrl(getRedirectUrl)}`;
        }
    }

    public loginWithToken(jwt: string, rememberMe: boolean): Promise<unknown> {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    public loginSuccess(): void {
        this.document.body.classList.remove('xm-public-screen');
        if (this.router.url === '/register'
            // eslint-disable-next-line @typescript-eslint/prefer-includes
            || ((/activate/).test(this.router.url))
            || this.router.url === '/finishReset'
            || this.router.url === '/requestReset') {
            this.router.navigate(['']);
        }

        this.eventManager.broadcast({
            name: XM_EVENT_LIST.XM_SUCCESS_AUTH,
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

    /** @deprecated use logout$*/
    public logout(): void {
        this.authServerProvider.logout().subscribe();
        this.principal.logout();
        this.router.navigate(['']);
    }

    public logout$(): Observable<void> {
        return this.authServerProvider.logout().pipe(
            // TODO: replace with session subscription
            map(() => this.principal.logout()),
        );
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
