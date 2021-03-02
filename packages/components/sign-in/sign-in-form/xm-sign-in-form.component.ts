import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { XmSignInFormOptions } from '@xm-ngx/components/sign-in/sign-in-form/xm-sign-in-form.options';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { SignInForm, SignInService } from './sign-in.service';

@Component({
    selector: 'xm-sign-in-form',
    host: { class: 'xm-sign-in-form' },
    templateUrl: './xm-sign-in-form.component.html',
    styleUrls: ['./xm-sign-in-form.component.scss'],
})
export class XmSignInFormComponent {

    public group: FormGroup = new FormGroup({
        username: new FormControl(),
        password: new FormControl(),
        rememberMe: new FormControl(true),
    });

    public error$: Subject<string | null> = new Subject<string | null>();
    public loading$: Observable<boolean> = this.signInService.loading$();

    @Input() public options: XmSignInFormOptions;
    @Output() public afterSignIn: EventEmitter<SignInForm> = new EventEmitter<SignInForm>();

    constructor(private signInService: SignInService) {
    }

    public onSubmit(): void {
        const form = this.group.getRawValue();
        this.error$.next(null);
        this.signInService.signIn(form).subscribe({
            next: () => {
                this.afterSignIn.emit(null);
            },
            error: (error: { message: string }) => {
                this.error$.next(error.message);
            },
        });
    }

}
