import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
// TODO: remove external deps
import { AuthServerProvider } from '../../../../src/app/shared/auth/auth-jwt.service';
import { XmAuthenticationRepository } from './xm-authentication-repository.service';

export const ERROR_CODE_UNAUTHORIZED = 401;
export const TOKEN_URL = 'uaa/oauth/token';

@Injectable()
export class XmAuthenticationService {

    constructor(
        private authenticationRepository: XmAuthenticationRepository,
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
                    return this.authenticationRepository.refreshToken();
                }
                return this.authenticationRepository.refreshGuestAccessToken();
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


