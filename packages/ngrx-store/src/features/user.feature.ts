import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { updateState } from '@angular-architects/ngrx-toolkit';

export const withUser = <_>(): SignalStoreFeature => {
    return signalStoreFeature(
        withMethods((store) => ({
            updateUser(user: any): void {
                updateState(store, 'Update user', { user });
            },
        })),
    );
};
