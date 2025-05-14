import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const oneItemInArrayRequired = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: unknown = control.value;

        if (!value || !Array.isArray(value) || !value.length) {
            return { oneItemInArrayRequired: true };
        }

        return null;
    };
};
