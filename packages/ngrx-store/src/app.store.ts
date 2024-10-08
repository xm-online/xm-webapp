import { signalStore, withState } from '@ngrx/signals';
import { AppState } from './models/app-store.type';
import { withLogger } from './features/logger.feature';
import { withDashboard } from '@xm-ngx/ngrx-store/src/features/dashboard.feature';
import { withHttpRequest } from '@xm-ngx/ngrx-store/src/features/http-request.feature';

const initialAppState: AppState = {
    user: null,
    dashboard: null,
    httpRequest: {},
    widgets: {},
};

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withLogger('AppStore'),
    withDashboard(),
    withHttpRequest(),
);

