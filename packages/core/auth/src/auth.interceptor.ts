import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { XmCoreConfig } from '@xm-ngx/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';

import { XmAuthenticationStoreService } from './xm-authentication-store.service';
import { XmAuthenticationService } from './xm-authentication.service';
import { AUTH_TOKEN } from './xm-authentication-store.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private readonly authService: XmAuthenticationService = inject(XmAuthenticationService);
    private readonly authStoreService: XmAuthenticationStoreService = inject(XmAuthenticationStoreService);
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly router: Router = inject(Router);
    private readonly coreConfig: XmCoreConfig = inject(XmCoreConfig);

    private refreshInProgress: boolean = false;
    private refreshSubject: Subject<boolean> = new Subject<boolean>();

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.skipRequest(request)) {
            return next.handle(request);
        }

        const clone: HttpRequest<unknown> = request.clone();
        return this.request(clone)
            .pipe(
                switchMap((req: HttpRequest<unknown>) => next.handle(req)),
                catchError((res: HttpErrorResponse) => this.responseError(clone, res)),
            );
    }

    private request(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
        if (this.refreshInProgress) {
            return this.delayRequest(req);
        }
        return this.updateToken(req);
    }

    private delayRequest(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
        return this.refreshSubject.pipe(
            first(),
            switchMap((status: boolean) =>
                status ? this.updateToken(req) : throwError(() => req),
            ),
        );
    }

    private skipRequest(req: HttpRequest<unknown>): boolean {
        return this.isInAppResource(req)
            || this.isPublicPage()
            || this.authService.verifyRefreshToken(req)
            || this.isExternalUrl(req)
            || this.isPublicConfig(req)
            || this.hasAuthorisationHeader(req);
    }

    private responseError(
        req: HttpRequest<unknown>,
        res: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        const refreshShouldHappen: boolean = this.authService.refreshShouldHappen(res);

        if (refreshShouldHappen && !this.refreshInProgress) {
            this.refreshInProgress = true;
            this.authService.refreshToken().subscribe({
                next: () => {
                    this.refreshInProgress = false;
                    this.refreshSubject.next(true);
                },
                error: () => {
                    this.refreshInProgress = false;
                    this.refreshSubject.next(false);
                },
            });
        }

        if (refreshShouldHappen && this.refreshInProgress) {
            return this.retryRequest(req, res);
        }

        return throwError(() => res);
    }

    private retryRequest(
        req: HttpRequest<unknown>,
        res: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        return this.refreshSubject.pipe(
            first(),
            switchMap((status: boolean) =>
                status ? this.httpClient.request(req) : throwError(() => res || req),
            ),
        );
    }

    private updateToken(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
        return this.authToken$
            .pipe(
                map((token: string) => {
                    if (token) {
                        let setHeaders: { [name: string]: string | string[] };

                        if (typeof this.authService.getHeaders === 'function') {
                            setHeaders = this.authService.getHeaders(token);
                        } else {
                            setHeaders = {Authorization: `Bearer ${token}`};
                        }

                        return req.clone({setHeaders});
                    }

                    return req;
                }),
                first(),
            );
    }

    private handleUrlQueryToken(): string | null {
        const params = new URLSearchParams(window.location.search);
        const token = params.get(AUTH_TOKEN);
        if (token) {
            console.info('Store auth token from url');
            this.authStoreService.storeAuthenticationToken(token, false);
        }
        return token;
    }

    private get authToken$(): Observable<string> {
        this.handleUrlQueryToken();
        const authToken: string = this.authStoreService.getAuthenticationToken();
        const authToken$: Observable<string> = this.authService.refreshToken().pipe(
            tap(() => {
                this.refreshInProgress = false;
                this.refreshSubject.next(true);
            }),
            map((auth: unknown) => auth?.['access_token']),
            catchError((err) => {
                this.refreshInProgress = false;
                this.refreshSubject.next(false);
                return throwError(() => err);
            }),
        );

        !authToken && (this.refreshInProgress = true);

        return authToken ? of(authToken) : authToken$;
    }


    private isPublicPage(): boolean {
        const stripedPath = (this.router.parseUrl(this.router.url)
            .root?.children?.primary?.segments || [])
            .map((it) => it.path)
            .join('/');
        // When user is anonymous he get 401 when request account, and can't reset password
        return (stripedPath === 'password/setup' || stripedPath === 'reset/finish');
    }

    private isExternalUrl(req: HttpRequest<unknown>): boolean {
        const servetApiUrl: string = this.coreConfig.SERVER_API_URL || '';
        return (/^http/).test(req.url) && !(servetApiUrl && req.url.startsWith(servetApiUrl));
    }

    private isPublicConfig(req: HttpRequest<unknown>): boolean {
        return this.coreConfig.UI_PUBLIC_CONFIG_URL === req.url;
    }

    private hasAuthorisationHeader(req: HttpRequest<unknown>): boolean {
        return Boolean(req.headers.get('Authorization'));
    }

    private isInAppResource(req: HttpRequest<unknown>): boolean {
        const inAppResources: string[] = ['./i18n/', this.coreConfig.UI_PUBLIC_TRANSLATIONS];
        return inAppResources.some((resource: string) => req.url.startsWith(resource));
    }
}
