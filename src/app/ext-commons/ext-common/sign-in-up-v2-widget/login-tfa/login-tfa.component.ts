import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList, ViewChild,
    ViewChildren
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { TimeFormatPipe } from './time-format.pipe';
import { MatButtonModule } from '@angular/material/button';
import { SignInUpService } from '../sign-in-up.service';
import { StateStorageService } from '@xm-ngx/core/auth';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { XmToasterService } from '@xm-ngx/toaster';
import { SignPageFormConfig } from '../sign-in-up-v2.model';
import { take } from 'rxjs/operators';
import { NgxMaskModule } from 'ngx-mask';
import { LettersControl } from '@xm-ngx/components/letter-control';

const REMAINING_TIME = 120;

@Component({
    selector: 'xm-login-tfa',
    templateUrl: './login-tfa.component.html',
    styleUrls: ['./login-tfa.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        XmTranslationModule,
        TimeFormatPipe,
        MatButtonModule,
        NgxMaskModule,
        LettersControl,
    ],
})
export class LoginTfaComponent implements OnInit, OnDestroy {
    @Input() public config: SignPageFormConfig;
    @Input() public loginLabel: string;
    @Input() public phone: string;
    @Output() public returnPrevAction: EventEmitter<string> = new EventEmitter<string>();
    public codeForm: FormGroup;
    public remainingTime: number = 0;
    public countdownTimer: any;
    public loading: boolean = false;
    @ViewChildren('digitInput') public digitInputs!: QueryList<ElementRef>;
    @ViewChild('lettersControl') public lettersControl: LettersControl;
    public otp: string = '';
    public authenticationError = false;

    constructor(protected signInUpService: SignInUpService,
                protected router: Router,
                protected route: ActivatedRoute,
                protected xmToasterService: XmToasterService,
                protected stateStorageService: StateStorageService) {
    }

    public ngOnInit(): void {
        this.startTimer();
        this.route.queryParams.pipe(takeUntilOnDestroy(this)).subscribe((res) => {
            this.phone = this.signInUpService.getDestination();
            if (!this.phone) {
                this.backToLogin();
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }

    private startTimer(): void {
        clearInterval(this.countdownTimer);
        this.remainingTime = REMAINING_TIME; // 2 minutes in seconds
        this.countdownTimer = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                clearInterval(this.countdownTimer);
                this.remainingTime = 0;
            }
        }, 1000);
    }

    public loginTFA(): void {
        this.loading = true;
        const credentials = {
            grant_type: 'tfa_otp_token',
            otp: this.otp,
            tfa_access_token: this.signInUpService.getAccessTokenValue(),
        };
        this.signInUpService.loginTFA(credentials).pipe(takeUntilOnDestroy(this)).subscribe((res) => {
            const tfaChannel = 'Phone';
            this.loading = false;
            this.stateStorageService.storeDestinationState(
                {
                    name: 'otpConfirmation',
                    data: {
                        tfaVerificationKey: res.otpId,
                        tfaChannel, phone: res.phone,
                    },
                },
                {},
                {name: 'login'});
        }, (error) => {
            this.loading = false;
            this.authenticationError = true;
            this.showError(error.error);
        });
    }


    public isFormDisabled(): boolean {
        return this.otp?.length < 6 || this.remainingTime === 0;
    }

    public backToLogin(): void {
        this.router.navigate([''], {queryParams: {page: 'SIGN-IN'}});
        this.returnPrevAction.emit('SIGN-IN');
        this.signInUpService.changeView('SIGN-IN');
    }

    public setValue(event: string): void {
        this.otp = event;
    }

    public resendSms(): void {
        this.loading = true;
        this.lettersControl.clear();
        this.signInUpService.reLogin().pipe(takeUntilOnDestroy(this)).subscribe(() => {
            this.loading = false;
            this.startTimer();
        }, (error) => {
            this.loading = false;
            this.showError(error.error);
        });

    }

    private showError(error: string): void {
        this.xmToasterService.create({
            type: 'danger',
            text: error,
        }).pipe(takeUntilOnDestroy(this), take(1)).subscribe();
    }

}
