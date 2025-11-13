import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { AppStoreActions } from '../models/app-store.model';

export const withToken = <_>(): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((store) => ({
            updateToken(token: any): void {
                updateState(store, AppStoreActions.TOKEN_UPDATE, {token});
            },
        })),
    );
};
