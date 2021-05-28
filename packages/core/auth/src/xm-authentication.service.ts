import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap, take } from 'rxjs/operators';
// TODO: remove external deps
import { AuthServerProvider } from '../../../../src/app/shared/auth/auth-jwt.service';
import { of } from 'rxjs';

export const ERROR_CODE_UNAUTHORIZED = 401;
export const TOKEN_URL = 'uaa/oauth/token';

@Injectable()
export class XmAuthenticationService {

    constructor(
        private serverProvider: AuthServerProvider,
        private sessionService: XmSessionService,
    ) {
    }

    public verifyRefreshToken(req: HttpRequest<unknown>): boolean {
        return req.url.endsWith(TOKEN_URL);
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === ERROR_CODE_UNAUTHORIZED;
    }

    public refreshToken(): Observable<unknown | null> {
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
                this.sessionService.clear();
                return of(null);
            }),
        );
    }

    public getHeaders(token: string): { [name: string]: string | string[] } {
        return { Authorization: `Bearer ${token}` };
    }
}


