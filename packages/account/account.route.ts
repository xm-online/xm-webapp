import { Routes } from '@angular/router';

import { activateRoute } from './activate/activate.route';
import { helpRoute } from './help/healp.route';
import { idpCallbackRoute } from './idp-callback/idp-callback.route';
import { loginErrorRoutes } from './login-error/login-error.route';
import { logoutRoute } from './logout/logout.route';
import { passwordResetFinishRoute } from './password-reset/finish/password-reset-finish.route';
import { passwordResetInitRoute } from './password-reset/init/password-reset-init.route';
import { passwordSetupRoute } from './password-reset/setup/password-setup.route';
import { passwordRoute } from './password/password.route';
import { settingsRoute } from './settings/settings.route';
import { registerRoute } from './sign-up/sign-up.route';

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
        ...loginErrorRoutes,
    ],
}];
