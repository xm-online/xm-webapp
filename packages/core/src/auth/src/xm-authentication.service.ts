import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap, take } from 'rxjs/operators';
import { AuthServerProvider, LoginService } from '../../../../../src/app/shared/auth';

export const ERROR_CODE_UNAUTHORIZED = 401;
export const TOKEN_URL = 'uaa/oauth/token';

@Injectable({ providedIn: 'root' })
export class XmAuthenticationService {

    constructor(
        private loginService: LoginService,
        private serverProvider: AuthServerProvider,
        private sessionService: XmSessionService,
    ) {
    }

    public verifyRefreshToken(req: HttpRequest<unknown>): boolean {
        return req.url.endsWith(TOKEN_URL);
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === 401;
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
            catchError(() => this.loginService.logout$()),
        );
    }

    public getHeaders(token: string): { [name: string]: string | string[] } {
        return { Authorization: `Bearer ${token}` };
    }
}


