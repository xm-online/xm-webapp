import { Routes } from '@angular/router';

import {
    activateRoute,
    helpRoute,
    passwordResetFinishRoute,
    passwordResetInitRoute,
    passwordRoute,
    passwordSetupRoute,
    registerRoute,
    settingsRoute,
    socialAuthRoute,
    socialRegisterRoute,
} from './';

const ACCOUNT_ROUTES = [
    activateRoute,
    helpRoute,
    passwordRoute,
    passwordResetFinishRoute,
    passwordSetupRoute,
    passwordResetInitRoute,
    registerRoute,
    socialAuthRoute,
    socialRegisterRoute,
    settingsRoute,
];

export const accountState: Routes = [
    {
        path: '',
        children: ACCOUNT_ROUTES,
    },
];
