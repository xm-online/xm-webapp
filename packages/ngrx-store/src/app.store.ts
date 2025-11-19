import { signalStore, withState } from '@ngrx/signals';
import { AppState, AppStoreSourceType } from './models/app-store.model';
import { withDashboard } from './features/dashboard.feature';
import { withUser } from './features/user.feature';
import { withToken } from './features/token.feature';
import { withDevtoolsByEnv } from './util/devtools-store';

const initialAppState: AppState = {
    user: null,
    dashboard: null,
    token: null,
};

export const AppStore: AppStoreSourceType = signalStore(
    {providedIn: 'root'},
    withState(initialAppState),
    withDevtoolsByEnv('appStore'),
    withUser(),
    withToken(),
    withDashboard(),
);
