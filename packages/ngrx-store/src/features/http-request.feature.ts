import { signalStoreFeature, SignalStoreFeature, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, mergeMap, pipe } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';

export const withHttpRequest = (): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((store, httpClient: HttpClient = inject(HttpClient)) => ({
            fetch: rxMethod<any>(
                pipe(
                    filter((config) => config.httpRequest?.method || config.httpRequest?.url),
                    mergeMap((config) => {
                        const { method, url, options } = config.httpRequest || {};
                        return httpClient.request(method, url, options).pipe(map((response) => ({response, config})));
                    }),
                    tap(({response, config}) => {
                        patchState(store, (state) => ({httpRequest: {...state['httpRequest'], [config.state.key]: response}}));
                    }),
                ),
            ),
        })),
    );
};
