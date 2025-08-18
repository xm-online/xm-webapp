import { withDevtools, withDevToolsStub } from '@angular-architects/ngrx-toolkit';
import { SignalStoreFeature } from '@ngrx/signals';
import { isDevMode } from '@angular/core';

export function withDevtoolsByEnv(name: string): SignalStoreFeature {

    return isDevMode()
        ? withDevtools(name)
        : withDevToolsStub(name);
}