import { signalStore, withState } from '@ngrx/signals';
import { AppState } from './models/app-store.model';
import { withDashboard } from './features/dashboard.feature';
import { withHttpRequest } from './features/http-request.feature';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withUser } from '@xm-ngx/ngrx-store/src/features/user.feature';

const initialAppState: AppState = {
    user: null,
    dashboard: null,
    httpRequest: {},
    widgets: {},
};

export const AppStore: any = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withDevtools('appStore'),
    withUser(),
    withDashboard(),
    withHttpRequest(),
);

