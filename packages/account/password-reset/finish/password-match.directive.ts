import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[matchPassword]',
    standalone: false,
    providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true}],
})
export class PasswordMatchDirective implements Validator {
    @Input('matchPassword') public MatchPassword: string[] = [];

    public validate(formGroup: FormGroup): ValidationErrors {
        const matchPasswordFn = (password: string, confirmPassword: string) => {
            return (formGroup: FormGroup) => {
                const passwordControl = formGroup.controls[password];
                const confirmPasswordControl = formGroup.controls[confirmPassword];

                if (!passwordControl || !confirmPasswordControl) {
                    return null;
                }

                if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                    return null;
                }

                if (passwordControl.value !== confirmPasswordControl.value) {
                    confirmPasswordControl.setErrors({passwordMismatch: true});
                } else {
                    confirmPasswordControl.setErrors(null);
                }
                return null;
            };
        };

        return matchPasswordFn(this.MatchPassword[0], this.MatchPassword[1])(formGroup);
    }
}
