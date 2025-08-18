import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppStoreActions } from '../models/app-store.model';

export const withDashboard = (): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((
            store: any,
        ) => ({
            updateDashboard: rxMethod(
                pipe(
                    tap((dashboard: any) => updateState(store, AppStoreActions.DASHBOARD_UPDATE, {dashboard})),
                ),
            ),
        })),
    );
};
