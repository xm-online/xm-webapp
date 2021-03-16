import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { LoginService } from '@xm-ngx/core/auth';
import { Subscription } from 'rxjs';

@Component({
    selector: 'xm-login-error',
    templateUrl: './login-error.component.html',
})
export class LoginErrorComponent implements OnDestroy {

    public errorKey: string;
    public paramsSubscription: Subscription

    constructor(
        protected route: ActivatedRoute,
        protected loginService: LoginService,
    ) {
        this.paramsSubscription = this.route.params
            .pipe(take(1))
            .subscribe(() => this.errorKey = 'error.invalid_credentials');
    }

    public ngOnDestroy(): void {
        this.paramsSubscription?.unsubscribe();
    }
}
