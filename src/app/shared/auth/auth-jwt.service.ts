import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { XmSessionService } from '@xm-ngx/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthRefreshTokenService, XmAuthenticationStoreService } from '../../../../packages/core/auth';
import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE, IDP_CLIENT } from '../../xm.constants';
import { CustomUriEncoder } from '../helpers/custom-uri-encoder';
import { Principal } from './principal.service';
import { StateStorageService } from './state-storage.service';
import { IIdpClient } from '../../../../packages/core/src/xm-public-idp-config-model';
import { TEMP_TOKEN } from './login.service';

const DEFAULT_HEADERS = {
    'Content-Type': DEFAULT_CONTENT_TYPE,
    Authorization: DEFAULT_AUTH_TOKEN,
};

const _TOKEN_URL = 'uaa/oauth/token';
const _CONFIG_SETTINGS_API = 'config/api/profile/webapp/settings-public.yml?toJson';
const TOKEN_STORAGE_KEY = 'WALLET-TOKEN';
const WIDGET_DATA = 'widget:data';
export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

export const TOKEN_URL = _TOKEN_URL;
export const CONFIG_SETTINGS_API = _CONFIG_SETTINGS_API;

interface GuestTokenResponse {
    access_token?: string;
}

export interface AuthTokenResponse extends GuestTokenResponse {
    refresh_token?: string;
    expires_in?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {

    constructor(
        private principal: Principal,
        private http: HttpClient,
        private sessionService: XmSessionService,
        private storeService: XmAuthenticationStoreService,
        private refreshTokenService: AuthRefreshTokenService,
        private $sessionStorage: SessionStorageService,
        private stateStorageService: StateStorageService,
        private router: Router,
    ) {
    }

    public init(): void {
        const isRememberMe = this.storeService.isRememberMe();
        this.setAutoRefreshTokens(isRememberMe);
    }

    public getToken(): string {
        return this.storeService.getAuthenticationToken();
    }

    public getRefreshToken(): string {
        return this.storeService.getRefreshToken();
    }

    public acceptTermsAndConditions(tocOneTimeToken: string): Observable<any> {
        const headers = {
            Authorization: DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Accept: 'application/json',
        };
        return this.http
            .post(`/uaa/api/users/accept-terms-of-conditions/${tocOneTimeToken}`, {}, { headers });
    }

    public login(credentials: any): Observable<any> {
        let data = new HttpParams({ encoder: new CustomUriEncoder() });
        this.$sessionStorage.clear(WIDGET_DATA);

        if (credentials && !credentials.grant_type) {
            data = data.append('grant_type', 'password');
            data = data.append('username', credentials.username);
            data = data.append('password', credentials.password);
        } else {
            data = data.append('grant_type', credentials.grant_type);
            if (credentials.grant_type === 'tfa_otp_token') {
                data = data.append('otp', credentials.otp);
                data = data.append('tfa_access_token_type', 'bearer');
                data = data.append('tfa_access_token', this.getToken());
            } else {
                data = data.append('username', credentials.username);
                data = data.append('password', credentials.password);
            }
        }

        return this.getAccessToken(data, DEFAULT_HEADERS, credentials.rememberMe).pipe(
            tap(() => this.sessionService.create()),
        );
    }

    public loginIdp(opt: any): Observable<any> {
        const config: IIdpClient = this.$sessionStorage.retrieve(IDP_CLIENT);
        const params = new HttpParams({ fromObject: opt });

        return of({body: TEMP_TOKEN}).pipe(
            map((resp) => {
                // @TODO: refactor this
                this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
                const rememberMe = false;
                const result = resp.body;
                const accessToken = this.storeAT(result, rememberMe);
                this.stateStorageService.resetDestinationState();
                this.storeRT(result, rememberMe);
                return accessToken;
            }),
            tap(() => this.sessionService.create()),
        )

        return this.http.get<any>(`login/oauth2/code/${config.key}`, { params }).pipe(
            map((resp) => {
                // @TODO: refactor this
                this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
                const rememberMe = false;
                const result = resp.body;
                const accessToken = this.storeAT(result, rememberMe);
                this.stateStorageService.resetDestinationState();
                this.storeRT(result, rememberMe);
                return accessToken;
            }),
            tap(() => this.sessionService.create()),
        );
    }

    public loginWithToken(jwt: string, rememberMe: boolean, refreshToken?: string, expiresIn?: number): Promise<never> | Promise<unknown> {
        this.$sessionStorage.clear(WIDGET_DATA);
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);

            if (refreshToken) {
                this.storeRefreshToken(refreshToken, rememberMe);
            }

            if (expiresIn) {
                this.refreshTokenService.setExpirationTime(new Date().setSeconds(expiresIn), rememberMe);
            }

            return Promise.resolve(jwt);
        } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    public storeAuthenticationToken(jwt: string, rememberMe: boolean): void {
        this.storeService.storeAuthenticationToken(jwt, rememberMe);
    }

    public storeRefreshToken(jwt: string, rememberMe: boolean): void {
        this.storeService.storeRefreshToken(jwt, rememberMe);
    }

    public logout(): Observable<any> {
        return new Observable((observer) => {
            this.storeService.clear();
            this.refreshTokenService.clear();
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            this.$sessionStorage.clear(WIDGET_DATA);
            observer.next();
            observer.complete();
        }).pipe(
            switchMap(() => {
                this.sessionService.clear();
                return this.getGuestAccessToken();
            }),
        );
    }


    public updateTokens(data: AuthTokenResponse, rememberMe: boolean = this.storeService.isRememberMe()): void {
        this.storeAT(data, rememberMe);
        this.storeRT(data, rememberMe);
        if (data.refresh_token) {
            this.sessionService.update();
        }
    }

    public refreshToken(): Observable<AuthTokenResponse> {
        const headers = {
            Authorization: DEFAULT_AUTH_TOKEN,
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Accept: 'application/json',
        };

        const body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.getRefreshToken());

        return this.http.post<AuthTokenResponse>(TOKEN_URL, body, { headers });
    }

    public refreshGuestAccessToken(): Observable<GuestTokenResponse> {
        const data = new HttpParams().set('grant_type', 'client_credentials');
        const headers = {
            'Content-Type': DEFAULT_CONTENT_TYPE,
            Authorization: DEFAULT_AUTH_TOKEN,
        };
        return this.http.post<GuestTokenResponse>(
            'uaa/oauth/token',
            data,
            { headers },
        );
    }

    public refreshTokens(rememberMe: boolean = this.storeService.isRememberMe()): void {
        this.refreshToken().subscribe((data) => {
            this.storeAT(data, rememberMe);
            this.storeRT(data, rememberMe);
            this.sessionService.update();
        }, (error) => {
            console.info('Refresh token fails: %o', error);
            this.logout().subscribe();
            this.principal.logout();
            this.router.navigate(['']);
            this.sessionService.clear();
        });
    }

    private getGuestAccessToken(): Observable<void> {
        return this.refreshGuestAccessToken().pipe(
            map((res) => {
                this.loginWithToken(res.access_token, false);
            }),
        );
    }

    private storeAT(resp: AuthTokenResponse, rememberMe: boolean): string {
        const accessToken = resp[ACCESS_TOKEN];
        if (accessToken) {
            this.storeAuthenticationToken(accessToken, rememberMe);
        }
        return accessToken;
    }

    private storeRT(resp: AuthTokenResponse, rememberMe: boolean): void {
        const refreshToken = resp[REFRESH_TOKEN];
        if (refreshToken) {
            this.refreshTokenService.start(resp.expires_in, () => this.refreshTokens(rememberMe));
            this.storeRefreshToken(refreshToken, rememberMe);
        }
    }

    private getAccessToken(data: any, headers: any, rememberMe: boolean): Observable<any> {
        return this.http.post<any>(TOKEN_URL, data, { headers, observe: 'response' }).pipe(map((resp) => {
            this.$sessionStorage.clear(TOKEN_STORAGE_KEY);
            const result = resp.body;
            let accessToken;
            let tfaChannel = '';

            if (resp.headers.get('icthh-xm-tfa-otp') === 'required') {
                tfaChannel = resp.headers.get('icthh-xm-tfa-otp-channel');
                console.info('tfaRequired=%s using %s', true, tfaChannel);

                this.stateStorageService.storeDestinationState(
                    {
                        name: 'otpConfirmation',
                        data: { tfaVerificationKey: result.tfaVerificationKey, tfaChannel },
                    },
                    {},
                    { name: 'login' });

                accessToken = this.storeAT(result, rememberMe);
            } else {
                this.stateStorageService.resetDestinationState();
                accessToken = this.storeAT(result, rememberMe);
                this.storeRT(result, rememberMe);
            }
            return accessToken;
        }));
    }

    private setAutoRefreshTokens(rememberMe: boolean, expiresIn: number = null): void {
        if (this.getRefreshToken()) {
            this.sessionService.create();
            this.refreshTokenService.start(expiresIn, () => {
                if (this.getRefreshToken()) {
                    this.refreshTokens(rememberMe);
                }
            });
        } else {
            // TODO: move to interceptor
            this.getGuestAccessToken().subscribe(() => this.sessionService.create({ active: false }));
        }
    }
}
