import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import { Router } from '@angular/router';
import { XmUIConfig } from '@xm-ngx/core/config';
import { CommonModule } from '@angular/common';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { finalize } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { XmSharedModule } from '@xm-ngx/shared';
import { SignInUpService } from '../sign-in-up.service';
import { XmEmailControl, XmPasswordControl } from '@xm-ngx/components/text';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { XmToasterService } from '@xm-ngx/toaster';

export interface XmLoginFormUIConfig extends XmUIConfig {
    hideRememberMe: boolean;
    hideResetPasswordLink: boolean;
}

@Component({
    selector: 'xm-login-v2',
    templateUrl: './login-v2.component.html',
    styleUrls: ['./login-v2.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatInputModule,
        XmSharedModule,
        XmPasswordControl,
        XmEmailControl,
        ReactiveFormsModule,
        MatFormFieldModule
    ],

})
export class LoginV2Component implements OnDestroy {
    @Input() public loginLabel: string;
    @Input() public config: any;
    @Output() public changeStateEvent: EventEmitter<string> = new EventEmitter<string>();
    public isShowPassword: boolean = false;
    public authenticationError: boolean;
    public checkOTP: boolean;
    public otpValue: string;
    public floatLabel: boolean;
    public loading: boolean = false;

    public group: FormGroup = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        rememberMe: new FormControl(true),
    });

    constructor(
        protected router: Router,
        protected signInUpService: SignInUpService,
        protected xmToasterService: XmToasterService,
    ) {
        this.checkOTP = false;
        this.otpValue = '';
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public login(): void | null {
        this.loading = true;
        this.authenticationError = false;
        this.signInUpService.login(this.createLoginData()).pipe(takeUntilOnDestroy(this), finalize(() => {
            this.loading = false;
        })).subscribe((res) => {
            this.loading = false;
            if (this.config && this.config?.next) {
                res.next = this.config.next;
            }
            if (!res.otpId) {
                this.signInUpService.updateTokens(res, true);
            }else{
                this.changeStateEvent.emit(res);
                this.router.navigate([''],{queryParams: {page: this.config.next}});
                this.signInUpService.changeView(this.config.next);
            }
        }, (error) => {
            this.loading = false;
            this.showError(error.error);
        });
    }


    private createLoginData(): LoginData {
        return {
            grant_type: 'password',
            username: this.group.controls.username.value ? this.group.controls.username.value.toLowerCase().trim() : '',
            password: this.group.controls.password.value ? this.group.controls.password.value.trim() : '',
            rememberMe: this.group.controls.rememberMe?.value || false,
        };
    }

    public requestResetPassword(): void {
        this.router.navigate(['/reset', 'request']);
    }

    public isFormDisabled(): boolean {
        return this.group.invalid;
    }

    public registration(): void {
        this.router.navigate(['', 'sign-up']);
    }
    private showError(error: string): void {
        this.xmToasterService.create({
            type: 'danger',
            text: error,
        }).subscribe();
    }
}

interface LoginData {
    grant_type: string,
    username: string,
    password: string,
    rememberMe: boolean,
}
