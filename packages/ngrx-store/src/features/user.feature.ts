import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { AppStoreActions } from '../models/app-store.model';

export const withUser = <_>(): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((store) => ({
            updateUser(user: any): void {
                updateState(store, AppStoreActions.USER_UPDATE, {user});
            },
        })),
    );
};
