import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: unknown = control.value;

        if (!value || typeof value !== 'string') {
            return null;
        }

        try {
            new URL(value);
            return null;
        } catch (error) {
            return { invalidUrl: true };
        }
    };
}
