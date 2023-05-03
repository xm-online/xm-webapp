import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_AUTH_TOKEN, DEFAULT_CONTENT_TYPE } from '../../../xm.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomUriEncoder } from '@xm-ngx/shared/helpers/custom-uri-encoder';
import {
    ACCESS_TOKEN,
    AuthRefreshTokenService,
    AuthTokenResponse,
    REFRESH_TOKEN,
    TOKEN_URL,
    XmAuthenticationRepository,
    XmAuthenticationStoreService
} from '@xm-ngx/core/auth';
import { map, tap } from 'rxjs/operators';
import { XmSessionService } from '@xm-ngx/core';

const DEFAULT_HEADERS = {
    'Content-Type': DEFAULT_CONTENT_TYPE,
    Authorization: DEFAULT_AUTH_TOKEN,
};

@Injectable({
    providedIn: 'root',
})
export class SignInUpService {
    private destination: string = '';
    private otpId: number;
    private token: string;
    private credentials;
    public state: BehaviorSubject<string>;
    private currentView = new BehaviorSubject<string>('SIGN-IN');

    constructor(private storeService: XmAuthenticationStoreService,
                private sessionService: XmSessionService,
                protected refreshTokenService: AuthRefreshTokenService,
                protected authenticationRepository: XmAuthenticationRepository,
                private http: HttpClient) {
    }


    public login(credentials: any): Observable<any> {
        this.credentials = credentials;
        const data = this.createRequestData(credentials);
        return this.getAccessToken(data, DEFAULT_HEADERS, credentials.rememberMe).pipe(
            tap((resp) => {
                //this.changeView('SIGN-TFA');
            }),
        );
    }

    public loginTFA(credentials: any): Observable<any> {
        const data = this.createRequestData(credentials);
        return this.getAccessToken(data, DEFAULT_HEADERS, credentials.rememberMe).pipe(
            tap(() => this.sessionService.create()),
        );
    }


    private createRequestData(credentials: any): HttpParams {
        let data = new HttpParams({encoder: new CustomUriEncoder()});
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
        return data;
    }


    private getAccessToken(data: any, headers: any, rememberMe: boolean): Observable<any> {
        return this.http.post<any>(TOKEN_URL, data, {headers, observe: 'response'})
            .pipe(map((resp) => {
                const result = resp.body;
                this.token = this.storeAT(result, rememberMe);
                this.destination = result.destination;
                return result;
            }));
    }

    public reLogin(): Observable<any> {
        return this.login(this.credentials);
    }

    public getCredentials(): any {
        return this.credentials;
    }

    public getDestination(): string {
        return this.destination;
    }

    public getAccessTokenValue(): string {
        return this.token;
    }

    public getOtpId(): number {
        return this.otpId;
    }

    public storeAuthenticationToken(jwt: string, rememberMe: boolean): void {
        this.storeService.storeAuthenticationToken(jwt, rememberMe);
    }

    public updateTokens(data: AuthTokenResponse, rememberMe: boolean = this.storeService.isRememberMe()): void {
        this.storeAT(data, rememberMe);
        this.storeRT(data, rememberMe);
        if (data.refresh_token) {
            this.sessionService.update();
        }
    }

    public refreshTokens(rememberMe: boolean = this.storeService.isRememberMe()): void {
        this.refreshToken().subscribe((data) => {
            this.storeAT(data, rememberMe);
            this.storeRT(data, rememberMe);
            this.sessionService.update();
        }, (error) => {
            console.info('Refresh token fails: %o', error);
            this.sessionService.clear();
        });
    }

    public refreshToken(): Observable<AuthTokenResponse> {
        return this.authenticationRepository.refreshToken();
    }


    public storeAT(resp: AuthTokenResponse, rememberMe: boolean): string {
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

    public storeRefreshToken(jwt: string, rememberMe: boolean): void {
        this.storeService.storeRefreshToken(jwt, rememberMe);
    }

    public getToken(): string {
        return this.storeService.getAuthenticationToken();
    }

    public changeView(view: string): void {
        this.currentView.next(view);
    }

    public getView(): Observable<string> {
        return this.currentView.asObservable();
    }

}
