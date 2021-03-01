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
    idpCallbackRoute,
    loginErrorRoute,
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
        socialAuthRoute,
        socialRegisterRoute,
        settingsRoute,
        logoutRoute,
        idpCallbackRoute,
        loginErrorRoute,
    ],
}];
