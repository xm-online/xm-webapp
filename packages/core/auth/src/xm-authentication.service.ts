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

@Injectable({providedIn: 'root'})
export class XmAuthenticationService {

    constructor(
        private authenticationRepository: XmAuthenticationRepository,
        private authenticationConfig: XmAuthenticationConfig,
        private storeService: XmAuthenticationStoreService,
        private refreshTokenService: AuthRefreshTokenService,
        private sessionService: XmSessionService,
        private xmAuthTargetUrlService: XmAuthTargetUrlService,
        private router: Router,
    ) {
    }

    public verifyRefreshToken(req: HttpRequest<unknown>): boolean {
        return req.url.endsWith(this.authenticationConfig.tokenUrl);
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === this.authenticationConfig.errorCodeUnauthorized;
    }

    public refreshToken(): Observable<unknown | null> {
        // Single-flight across tabs: while one tab refreshes, others wait and
        // then reuse the freshly stored token instead of issuing a duplicate
        // (stale) refresh that a single-session backend would reject.
        // No-op wrapper (returns performRefresh()) when the feature is disabled.
        return this.refreshTokenService.runExclusive(
            () => this.performRefresh(),
            () => of(this.storeService.getAuthenticationToken()),
        );
    }

    /**
     * Core refresh logic shared by both the reactive (401) and proactive (leader timer) paths.
     * Does NOT catch errors — callers are responsible for error handling.
     */
    private rawRefresh(): Observable<unknown> {
        return this.sessionService.isActive().pipe(
            take(1),
            switchMap((active) => {
                if (active) {
                    return this.authenticationRepository.refreshToken();
                }
                return this.authenticationRepository.refreshGuestAccessToken();
            }),
            tap((res) => this.updateTokens(res)),
        );
    }

    private performRefresh(): Observable<unknown | null> {
        return this.rawRefresh().pipe(
            catchError(() => {
                this.sessionService.clear();
                this.xmAuthTargetUrlService.storeCurrentUrl();
                this.router.navigate(['']);
                return of(null);
            }),
        );
    }

    /**
     * Proactive refresh callback for the leader timer.
     *
     * Unlike {@link refreshToken}, this does NOT catch errors or navigate to the
     * login page on failure. Instead, {@link AuthRefreshTokenService} applies
     * exponential backoff-retry and stops scheduling once the token is past its
     * expiry, at which point the next API request receives a 401 that the
     * interceptor handles in the usual way.
     */
    private proactiveRefresh(): Observable<unknown> {
        return this.refreshTokenService.runExclusive(
            () => this.rawRefresh(),
            () => of(this.storeService.getAuthenticationToken()),
        );
    }

    public getHeaders(token: string): { [name: string]: string | string[] } {
        return {Authorization: `Bearer ${token}`};
    }

    // return true when it's guest, and return false when not sure
    public isSureGuestSession(): boolean {
        if (this.storeService.hasRefreshToken()) {
            return false;
        }
        if (!this.storeService.hasAuthenticationToken()) {
            return true;
        }

        try {
            const jwt = this.storeService.getAuthenticationToken();
            const token = JSON.parse(atob(jwt.split('.')[1]));
            if (!token.user_key && token.authorities?.length === 1 && token.authorities[0] === ROLE_ANONYMOUS) {
                return true;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        return false; //default false
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
        // Pass proactiveRefresh (no navigation on failure) so the refresh-token
        // service can retry with backoff without immediately sending the user to
        // the login page on a transient network error.
        this.refreshTokenService.start(data.expires_in, () => this.proactiveRefresh());

        this.sessionService.update();

    }
}


