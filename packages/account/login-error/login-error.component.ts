import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@xm-ngx/components/login';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { take } from 'rxjs/operators';

@Component({
    selector: 'xm-login-error',
    templateUrl: './login-error.component.html',
    standalone: false,
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
