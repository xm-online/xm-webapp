import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';

@Component({
  selector: 'xm-idp-callback',
  templateUrl: './idp-callback.component.html',
  styleUrls: ['./idp-callback.component.scss']
})
export class IdpCallbackComponent implements OnDestroy {

    public params!: Subscription;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private activeRouter: ActivatedRoute,
    ) {
        this.params = this.activeRouter.queryParams.subscribe(params => {
            if (activeRouter.snapshot.data.callbackAuth && params) {
                this.loginService.loginWithIdpCallback(params);

            } else {
                this.router.navigate(['']);
            }
        });
    }

    public ngOnDestroy(): void {
        this.params && this.params.unsubscribe();
    }
}
