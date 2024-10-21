import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { fetchData, updateHttpRequestState } from '../functions/http.functions';

export const withHttpRequest = (): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((
            store,
            httpClient: HttpClient = inject(HttpClient),
            activatedRoute: ActivatedRoute = inject(ActivatedRoute),
        ) => ({
            fetch: rxMethod<any>(
                pipe(
                    filter((config) => config.httpRequest?.method || config.httpRequest?.url),
                    mergeMap((config) => fetchData(config, activatedRoute, httpClient)),
                    tap(({response, config}) => updateHttpRequestState(store, config, response, 'widget')),
                ),
            )
        })),
    );
};
