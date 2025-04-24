import { signalStore, withState } from '@ngrx/signals';
import { AppState, AppStoreSourceType } from './models/app-store.model';
import { withDashboard } from './features/dashboard.feature';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withUser } from './features/user.feature';

const initialAppState: AppState = {
    user: null,
    dashboard: null,
};

export const AppStore: AppStoreSourceType = signalStore(
    {providedIn: 'root'},
    withState(initialAppState),
    withDevtools('appStore'),
    withUser(),
    withDashboard(),
);

