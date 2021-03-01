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

export const TEMP_TOKEN = {
    'idp_id_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImR3enNVaXlTWkIzcTNSLW9IS3NpTCJ9.eyJnaXZlbl9uYW1lIjoiQW5kcml5IiwiZmFtaWx5X25hbWUiOiJLaWtvdCIsIm5pY2tuYW1lIjoiYW5kcmV3Lmtpa290IiwibmFtZSI6IkFuZHJpeSBLaWtvdCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHak1PQ1FiQmF6Wkt2MXpRcm1OTm1DeGpFYld6N0l2NHQ1ZVBGOWk9czk2LWMiLCJsb2NhbGUiOiJ1ayIsInVwZGF0ZWRfYXQiOiIyMDIxLTAzLTAxVDA5OjI1OjEwLjU4N1oiLCJlbWFpbCI6ImFuZHJldy5raWtvdEBqZXZlcmEuc29mdHdhcmUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYta3JlOWRvMDkuZXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA4MTIxMDg3MTAyMjczMTMwMjM4IiwiYXVkIjoiVDg4S3BkeFc3RkVmRUY4S0VYNTdhcHdka2lrcHpSekIiLCJpYXQiOjE2MTQ1OTA3NDQsImV4cCI6MTYxNDYyNjc0NCwibm9uY2UiOiJkR2lfeHZyRzJCajgwOXNhRjhoSzg2a0RNbUt0Z0NqSmxmdWhZY2ZRNWVJIn0.hUKPAp8TmKi8WNDezuoe0LPNvwTDvIPWyIFHDBI0llZnG8Mr5eYin1kyZ85cICYa5XS2hhEfC9LDqh6jgt4dol3tCnLQNcLSaL8Mga0pw9jCWi-JwCY7NkYzcnObbqxm99XBSVXvjQzbV0wN5CyNJeBHM3x79FC3xu9o_j-5KF4oX4EwHAFuX8nGg7ChVMoqw3juXMT_fVC5OlWGOKOTT-NSXjJQI6J6bIiPLvY-IRyxeuY2dVK5KUuU6Hj5ZIojALnHpuV4G4ScbuC6w_gUQj3uoxofpnu2yjqWZWz6CpJypzD-VfF3oIAbYdlocLgFZiPF7cW4ssG8YCd_I4E2bQ',
    'idpAccessTokenInclusion': {
        'enabled': true,
        'idpTokenHeader': 'Authorization',
        'xmTokenHeader': 'X-Authorization'
    },
    'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVUb2tlblRpbWUiOjE2MTQ1OTA3NDU4NTEsInVzZXJfbmFtZSI6ImFuZHJldy5raWtvdEBqZXZlcmEuc29mdHdhcmUiLCJzY29wZSI6WyJvcGVuaWQiXSwicm9sZV9rZXkiOiJST0xFX0FETUlOIiwidXNlcl9rZXkiOiI3OTIwNDc4Yy01ODllLTQ5OTYtODNjZS0xZjQyNGJkNjc0NTYiLCJleHAiOjE2MjU1OTA3NDUsImxvZ2lucyI6W3sidHlwZUtleSI6IkxPR0lOLkVNQUlMIiwic3RhdGVLZXkiOm51bGwsImxvZ2luIjoiYW5kcmV3Lmtpa290QGpldmVyYS5zb2Z0d2FyZSJ9XSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiIwMjZjNDQyOS1mNmY3LTRlNWQtYTRmYi03NzFkNDc0MjY4ZjciLCJ0ZW5hbnQiOiJTU1AiLCJjbGllbnRfaWQiOiJpbnRlcm5hbCJ9.UTJZEIDwULs408jp9jpOAUuSrizGijMBeYLaPfaLeZytCr2RbZ0931Br47IcNjTc9PEBbNMXpiCe_Wq8ITkZ1DOUpMOsX5n9R0gMMB5MUEq9Bdcu3eWd3EFSTouRKwtt4uHKhaO1YrAYCoF1jxVG4tuC8w3XdqVIsdOMvVIdH9wtP9ThBFQdHU0VPgSJocoZ0mvslYEjNonSw05lStSr_0D34LyMOVKKyH13cwd-9srd1dAEwbIlexTKsFNb5Q2sDXQKcgVoTCxZJCrK6tu_UUt5yWirwNnLk6p-60dahqw0MYO1UOkOCwbIqtHgXwAQt9bJY9JygaS_ZrQ1KFAYMA',
    'token_type': 'bearer',
    'refresh_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVUb2tlblRpbWUiOjE2MTQ1OTA3NDU4NTEsInVzZXJfbmFtZSI6ImFuZHJldy5raWtvdEBqZXZlcmEuc29mdHdhcmUiLCJzY29wZSI6WyJvcGVuaWQiXSwicm9sZV9rZXkiOiJST0xFX0FETUlOIiwiYXRpIjoiMDI2YzQ0MjktZjZmNy00ZTVkLWE0ZmItNzcxZDQ3NDI2OGY3IiwidXNlcl9rZXkiOiI3OTIwNDc4Yy01ODllLTQ5OTYtODNjZS0xZjQyNGJkNjc0NTYiLCJleHAiOjE2MjU1OTA3NDUsImxvZ2lucyI6W3sidHlwZUtleSI6IkxPR0lOLkVNQUlMIiwic3RhdGVLZXkiOm51bGwsImxvZ2luIjoiYW5kcmV3Lmtpa290QGpldmVyYS5zb2Z0d2FyZSJ9XSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI2ZmY2OTM5ZC0wZDQ0LTQxOTktYTg2Yi1kYmQ3ZDRhMDAzNmIiLCJ0ZW5hbnQiOiJTU1AiLCJjbGllbnRfaWQiOiJpbnRlcm5hbCJ9.p-DMhpC7Yqkjo8q3pVb7NP0ppErwkNqCGc1qjOhsadmHu8Oq0AIBtDSlvEf5UJHWguhNZA0c0gKOo-fLBp-EpdheH3ROkrQ58ieKnNH4FpXny77btfwjJCaQAQUb40rv2tbFICZxGJQ33RwRaBBJQBaa-Fb-SObUMpSpWHW4VD8pn9P_vCn9A0ILDNKyrR33Y0hzf9NHbwWr6wQuFij9cA08jlxolsUkELEcUuQgVgcp8uwV1cyunFkwwchnzlyPi1eDi-kE3CfNqqXesyeUZdHNSfuIdRXhHodkZSpFE_4Ed1lK4-FB2WWugY888pnWOSd9vpc9PFxYdOzizIkNgQ',
    'expires_in': 10999999,
    'scope': 'openid',
    'createTokenTime': 1614590745851,
    'role_key': 'ROLE_ADMIN',
    'user_key': '7920478c-589e-4996-83ce-1f424bd67456',
    'logins': [
        {
            'typeKey': 'LOGIN.EMAIL',
            'stateKey': null,
            'login': 'andrew.kikot@jevera.software'
        }
    ],
    'tenant': 'SSP',
    'jti': '026c4429-f6f7-4e5d-a4fb-771d474268f7'
}

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
        const isDirectLogin = config?.idp?.enabled && config?.idp?.features?.directLogin?.enabled;
        if (isDirectLogin) {
            const client = this.getIdpClient({idp: config?.idp} as IIdpConfig);
            this.$sessionStorage.store(IDP_CLIENT, client);
            this.loginWithIdpClient(client);
        }
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
