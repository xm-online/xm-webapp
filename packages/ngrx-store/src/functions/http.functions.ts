import { interpolate } from '@xm-ngx/operators';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { AppState } from '@xm-ngx/ngrx-store/src/models/app-store.model';
import { HttpRequestResponse } from '@xm-ngx/ngrx-store/src/models/http-request.model';

export const fetchData = <T>(config: any, activatedRoute: ActivatedRoute, httpClient: HttpClient): Observable<HttpRequestResponse<ArrayBuffer, any>> => {
    const { method, url, options} = config.httpRequest || {};
    const interpolatedUrl = interpolate(url, activatedRoute.snapshot.queryParams);
    return httpClient.request(method, interpolatedUrl, options).pipe(map((response) => ({response, config})));
}

export const updateHttpRequestState = <T>(store: any, config: any, response: T, source: string) => {
    updateState(store, `Update httpRequest (${source}), key – ${config.state.key}`, (state: AppState) => {
        return {
            ...state,
            httpRequest: {
                ...state.httpRequest,
                [config.state.key]: response,
            },
        };
    });
}

