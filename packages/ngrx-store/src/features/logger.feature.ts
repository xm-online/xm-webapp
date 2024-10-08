import { effect } from '@angular/core';
import { getState, signalStoreFeature, withHooks, SignalStoreFeature } from '@ngrx/signals';

const logState = (state: object, name: string) => {
    // eslint-disable-next-line no-console
    console.group(`%c${name}`, 'background: #555555; padding: 4px 8px; border-radius: 4px; color: #ffffff;');
    console.info(state);
    // eslint-disable-next-line no-console
    console.groupEnd();
};

export const withLogger = (name: string): SignalStoreFeature => {
    return signalStoreFeature(
        withHooks({
            onInit(store) {
                effect(() => {
                    const state = getState(store);
                    logState(state, name);
                });
            },
        }),
    );
};
