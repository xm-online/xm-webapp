import { Routes } from '@angular/router';
import { LoginErrorComponent } from './login-error.component';

export const loginErrorRoutes: Routes = [
    {
        path: 'login',
        component: LoginErrorComponent,
    },
    // {
    //     path: 'oauth2/authorization/:idpKey',
    //     component: LoginErrorComponent,
    // },
];
