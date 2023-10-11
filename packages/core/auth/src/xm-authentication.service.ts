import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { XmAuthenticationRepository } from './xm-authentication-repository.service';
import { XmAuthenticationStoreService } from './xm-authentication-store.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { GuestTokenResponse } from './guest-token.response';
import { AuthTokenResponse } from './auth-token.response';
import { XmAuthenticationConfig } from './xm-authentication-config.service';
import { Router } from '@angular/router';
import { XmAuthTargetUrlService } from './xm-auth-target-url.service';


export const ROLE_ANONYMOUS = 'ROLE_ANONYMOUS';

@Injectable()
export class XmAuthenticationService {

    constructor(
        private authenticationRepository: XmAuthenticationRepository,
        private authenticationConfig: XmAuthenticationConfig,
        private storeService: XmAuthenticationStoreService,
        private refreshTokenService: AuthRefreshTokenService,
        private sessionService: XmSessionService,
        private xmAuthTargetUrlService: XmAuthTargetUrlService,
        private router: Router
    ) {
    }

    public verifyRefreshToken(req: HttpRequest<unknown>): boolean {
        return req.url.endsWith(this.authenticationConfig.tokenUrl);
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === this.authenticationConfig.errorCodeUnauthorized;
    }

    public refreshToken(): Observable<unknown | null> {
        return this.sessionService.isActive().pipe(
            take(1),
            switchMap((active) => {
                if (active) {
                    return this.authenticationRepository.refreshToken();
                }
                return this.authenticationRepository.refreshGuestAccessToken();
            }),
            tap((res) => this.updateTokens(res)),
            catchError(() => {
                this.sessionService.clear();
                this.xmAuthTargetUrlService.storeCurrentUrl();
                this.router.navigate(['']);
                return of(null);
            }),
        );
    }

    public getHeaders(token: string): { [name: string]: string | string[] } {
        return { Authorization: `Bearer ${token}` };
    }

    // return true when it's guest, and return false when not sure
    public isSureGuestSession(): boolean {
        if (this.storeService.hasRefreshToken()) {
            return false;
        }
        if (!this.storeService.hasAuthenticationToken()) {
            return true;
        } else {
            try {
                const jwt = this.storeService.getAuthenticationToken();
                const token = JSON.parse(atob(jwt.split('.')[1]));
                if (!token.user_key && token.authorities?.length === 1 && token.authorities[0] === ROLE_ANONYMOUS) {
                    return true;
                }
            } catch (e) {
                console.error(e);
            }
            return false; //default false
        }

    }

    private updateTokens(res: AuthTokenResponse | GuestTokenResponse): void {
        const rememberMe: boolean = this.storeService.isRememberMe();

        this.storeService.storeAuthenticationToken(res.access_token, rememberMe);

        const data: AuthTokenResponse = res as AuthTokenResponse;
        if (!data.refresh_token || !data.expires_in) {
            return;
        }

        this.storeService.storeRefreshToken(data.refresh_token, rememberMe);
        // TODO: invert to listener of session change
        this.refreshTokenService.start(data.expires_in, () => this.refreshToken());

        this.sessionService.update();

    }
}


