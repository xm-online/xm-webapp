import { Injectable } from '@angular/core';
import { StateStorageService } from './state-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class XmAuthTargetUrlService {

    constructor(
        private stateStorageService: StateStorageService,
        private router: Router,
    ) {}

    public storeCurrentUrl(): void {
        this.stateStorageService.storeUrl(window.location.href.substring(window.location.origin.length));
    }

    public initialRedirect(): void {
        /*
         * PreviousState was set in the authExpiredInterceptor before being redirected to login modal.
         * since login is succesful, go to stored previousState and clear previousState
         */
        const redirect = this.stateStorageService.getUrl();
        // TODO: due to cashed dashboards data (which is null by the moment of dashboard navigation) we cannot navigate to appropriate route (guard returns false).
        // We need to investigate way to clean dashboard cache on user logout
        setTimeout(() => {
            if (redirect && redirect !== '/') {
                this.router.navigate([redirect]);
            } else {
                this.router.navigate(['dashboard']);
            }
        }, 100);
    }

    public cleanUrl(): void {
        this.stateStorageService.clearUrl();
    }
}
