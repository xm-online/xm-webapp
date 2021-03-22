import { Route } from '@angular/router';

import { UserRouteAccessService } from '@xm-ngx/core/auth';
import { IdpCallbackComponent } from './idp-callback.component';



export const idpCallbackRoute: Route = {
    path: 'callback/auth-complete',
    component: IdpCallbackComponent,
    data: {
        callbackAuth: true,
        authorities: [],
    },
    canActivate: [UserRouteAccessService],
};
