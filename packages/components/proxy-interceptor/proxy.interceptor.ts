import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

export const PROXY_INTERCEPTOR_URL = new InjectionToken('PROXY_INTERCEPTOR_URL');
export const PROXY_INTERCEPTOR_EXCLUDED_URLS = new InjectionToken('PROXY_INTERCEPTOR_EXCLUDED_URLS');

@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(@Inject(PROXY_INTERCEPTOR_URL) private url: string,
                @Inject(PROXY_INTERCEPTOR_EXCLUDED_URLS) private excludedUrls: string[]) {
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isExcluded: string = _.find(this.excludedUrls, (ex) => new RegExp(ex).test(request.url));

        if (!this.url || isExcluded) {
            return next.handle(request);
        }

        let url = request.url;
        if (!url.startsWith('/')) {
            url = `/${request.url}`;
        }
        url = this.url + url;

        const proxyRequest = request.clone({url});
        return next.handle(proxyRequest);
    }
}

export function proxyInterceptorFactory({url, excludedUrls}: { url: string; excludedUrls: string[] }): Provider[] {
    return [
        {provide: PROXY_INTERCEPTOR_URL, useValue: url},
        {provide: PROXY_INTERCEPTOR_EXCLUDED_URLS, useValue: excludedUrls || ['http']},
        {provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true},
    ];
}
