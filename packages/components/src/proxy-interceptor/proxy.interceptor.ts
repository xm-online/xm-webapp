import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(@Inject(PROXY_INTERCEPTOR_URL) private url: string) {
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (_.includes(request.url, 'http')) {
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

export const PROXY_INTERCEPTOR_URL = new InjectionToken('PROXY_INTERCEPTOR_URL');
export const PROXY_INTERCEPTOR: Provider = {provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true};

export function proxyInterceptorFactory(url: string): Provider[] {
    return [
        {provide: PROXY_INTERCEPTOR_URL, useValue: url},
        PROXY_INTERCEPTOR,
    ];
}
