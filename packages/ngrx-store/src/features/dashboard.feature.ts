import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { fetchData, updateHttpRequestState } from '../functions/http.functions';

export const withDashboard = <_>(): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((
            store: any,
            httpClient: HttpClient = inject(HttpClient),
            activatedRoute: ActivatedRoute = inject(ActivatedRoute),
        ) => ({
            updateDashboard: rxMethod<any>(
                pipe(
                    tap((dashboard: DashboardWithWidgets) => updateState(store, 'Update dashboard', { dashboard })),
                    filter(({config}) => !!config.httpRequest?.method || !!config.httpRequest?.url),
                    mergeMap(({config}) => fetchData(config, activatedRoute, httpClient)),
                    tap(({response, config}) => updateHttpRequestState(store, config, response, 'dashboard')),
                ),
            )
        })),
    );
};
