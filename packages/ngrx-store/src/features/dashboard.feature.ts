import { patchState, signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';

export const withDashboard = <_>(): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((store) => ({
            updateDashboard(dashboard: DashboardWithWidgets): void {
                patchState(store, { dashboard });
            },
        })),
    );
};
