import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxDateValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        function isEmptyInputValue(value: any): boolean {
            return value == null || value.length === 0;
        }

        if (isEmptyInputValue(control.value) || isEmptyInputValue(maxDate)) {
            return null;
        }

        const value = control.value;
        const date = new Date(value);
        return date > maxDate ? { maxDate: { maxDate, actual: date } } : null;
    };
}
