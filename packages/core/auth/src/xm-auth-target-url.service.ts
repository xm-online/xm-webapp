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
        if (redirect) {
            this.router.navigateByUrl(redirect);
        } else {
            this.router.navigate(['dashboard']);
        }
    }

    public cleanUrl(): void {
        this.stateStorageService.clearUrl();
    }
}
