import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { XmCoreConfig } from '@xm-ngx/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { XmAuthenticationStoreService } from './xm-authentication-store.service';
import { XmAuthenticationService } from './xm-authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private refreshInProgress: boolean = false;
    private refreshSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private injector: Injector) {
    }

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
                status ? this.updateToken(req) : throwError(req),
            ),
        );
    }

    private skipRequest(req: HttpRequest<unknown>): boolean {
        const authService: XmAuthenticationService = this.injector.get(XmAuthenticationService);
        return this.isPublicPage()
            || authService.verifyRefreshToken(req)
            || this.isExternalUrl(req)
            || this.isPublicConfig(req)
            || this.hasAuthorisationHeader(req);
    }

    private responseError(
        req: HttpRequest<unknown>,
        res: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        const authService: XmAuthenticationService = this.injector.get(XmAuthenticationService);
        const refreshShouldHappen: boolean = authService.refreshShouldHappen(res);

        if (refreshShouldHappen && !this.refreshInProgress) {
            this.refreshInProgress = true;

            authService.refreshToken().subscribe(
                () => {
                    this.refreshInProgress = false;
                    this.refreshSubject.next(true);
                },
                () => {
                    this.refreshInProgress = false;
                    this.refreshSubject.next(false);
                },
            );
        }

        if (refreshShouldHappen && this.refreshInProgress) {
            return this.retryRequest(req, res);
        }

        return throwError(res);
    }

    private retryRequest(
        req: HttpRequest<unknown>,
        res: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        const http: HttpClient = this.injector.get(HttpClient);

        return this.refreshSubject.pipe(
            first(),
            switchMap((status: boolean) =>
                status ? http.request(req) : throwError(res || req),
            ),
        );
    }

    private updateToken(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
        const authStoreService: XmAuthenticationStoreService = this.injector.get(XmAuthenticationStoreService);
        const authService: XmAuthenticationService = this.injector.get(XmAuthenticationService);

        return of(authStoreService.getAuthenticationToken())
            .pipe(
                map((token: string) => {
                    if (token) {
                        let setHeaders: { [name: string]: string | string[] };

                        if (typeof authService.getHeaders === 'function') {
                            setHeaders = authService.getHeaders(token);
                        } else {
                            setHeaders = { Authorization: `Bearer ${token}` };
                        }

                        return req.clone({ setHeaders });
                    }

                    return req;
                }),
                first(),
            );
    }


    private isPublicPage(): boolean {
        const router: Router = this.injector.get(Router);
        const stripedPath = (router.parseUrl(router.url)
            .root?.children?.primary?.segments || [])
            .map((it) => it.path)
            .join('/');
        // When user is anonymous he get 401 when request account, and can't reset password
        return (stripedPath === 'password/setup' || stripedPath === 'reset/finish');
    }

    private isExternalUrl(req: HttpRequest<unknown>): boolean {
        const coreConfig: XmCoreConfig = this.injector.get(XmCoreConfig);
        return (/^http/).test(req.url) && !(coreConfig.SERVER_API_URL && req.url.startsWith(coreConfig.SERVER_API_URL));
    }

    private isPublicConfig(req: HttpRequest<unknown>): boolean {
        const coreConfig: XmCoreConfig = this.injector.get(XmCoreConfig);
        return coreConfig.UI_PUBLIC_CONFIG_URL === req.url;
    }

    private hasAuthorisationHeader(req: HttpRequest<unknown>): boolean {
        return Boolean(req.headers.get('Authorization'));
    }
}
