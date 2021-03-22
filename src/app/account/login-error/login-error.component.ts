import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { take } from 'rxjs/operators';
import { LoginService } from '@xm-ngx/core/auth';

@Component({
    selector: 'xm-login-error',
    templateUrl: './login-error.component.html',
})
export class LoginErrorComponent implements OnDestroy {

    public errorKey: string;

    constructor(
        protected route: ActivatedRoute,
        protected loginService: LoginService,
    ) {
        this.route.params
            .pipe(
                takeUntilOnDestroy(this),
                take(1),
            )
            .subscribe(() => this.errorKey = 'error.invalid_credentials');
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
