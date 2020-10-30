import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
// TODO: remove external deps
import { AuthServerProvider } from '../../../../src/app/shared/auth/auth-jwt.service';

export const ERROR_CODE_UNAUTHORIZED = 401;
export const TOKEN_URL = 'uaa/oauth/token';

@Injectable()
export class XmAuthenticationService {

    /**
     * @todo: the logout should be connected to the session service
     *   and emmited when the active session becomes false
     * @private
     */
    private _logout$: Subject<void> = new Subject();

    constructor(
        private serverProvider: AuthServerProvider,
        private sessionService: XmSessionService,
    ) {
    }

    public logout$(): Observable<void> {
        return this._logout$.asObservable();
    }

    public verifyRefreshToken(req: HttpRequest<unknown>): boolean {
        return req.url.endsWith(TOKEN_URL);
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === ERROR_CODE_UNAUTHORIZED;
    }

    public refreshToken(): Observable<unknown> {
        return this.sessionService.isActive().pipe(
            take(1),
            switchMap((active) => {
                if (active) {
                    return this.serverProvider.refreshToken();
                }
                return this.serverProvider.refreshGuestAccessToken();
            }),
            tap((res) => this.serverProvider.updateTokens(res)),
            catchError(() => {
                this.logout();
                return of(null);
            }),
        );
    }

    public getHeaders(token: string): { [name: string]: string | string[] } {
        return { Authorization: `Bearer ${token}` };
    }

    public logout(): void {
        this._logout$.next();
    }
}
