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
    idpCallbackRoute,
    loginErrorRoutes,
} from './';
import { logoutRoute } from './logout/logout.route';

export const accountState: Routes = [{
    path: '',
    children: [
        activateRoute,
        helpRoute,
        passwordRoute,
        passwordResetFinishRoute,
        passwordSetupRoute,
        passwordResetInitRoute,
        registerRoute,
        settingsRoute,
        logoutRoute,
        idpCallbackRoute,
        ...loginErrorRoutes
    ],
}];
