import { Inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthServerProvider } from './auth-jwt.service';
import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';
// import { SessionStorageService } from 'ngx-webstorage';
// import { IIdpClient } from '../spec';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { DEV_TOKEN, IDP_CLmIENT } from '../../xm.constants';
import { DEV_TOKEN, XM_EVENT_LIST } from '../../xm.constants';
import { XmEventManager } from '@xm-ngx/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class LoginService {

    constructor(private principal: Principal,
                private router: Router,
                private authServerProvider: AuthServerProvider,
                private stateStorageService: StateStorageService,
                protected eventManager: XmEventManager,
                @Inject(DOCUMENT) private document: Document,
                // private $sessionStorage: SessionStorageService,
                // private http: HttpClient,
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

    public loginWithCode(opt: any): void {
        // const config: IIdpClient = this.$sessionStorage.retrieve(IDP_CLIENT);
        // const params = new HttpParams({ fromObject: opt });

        if (isDevMode()) {
            this.loginWithToken(DEV_TOKEN, true).then(() => {
                this.loginSuccess();
            })
        }
        // this.http.get(`login/oauth2/code/${config.key}`, { params }).subscribe(
        //     (res: any) => {
        //         if (res.access_token) {
        //             this.authServerProvider.storeAuthenticationToken(res.access_token, true);
        //             this.router.navigate(['']);
        //         }
        //     },
        //     err => {
        //         console.info(err)
        //         this.router.navigate(['']);
        //     }
        // );
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
}
