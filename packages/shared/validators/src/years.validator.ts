import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function yearsValidator(years: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        function isEmptyInputValue(value: any): boolean {
            return value == null || value.length === 0;
        }

        if (isEmptyInputValue(control.value) || isEmptyInputValue(years)) {
            return null;
        }

        const value = control.value;
        const date = new Date(value);
        const today = new Date();
        const currentYears = today.getFullYear() - date.getFullYear();
        return !isNaN(currentYears) && currentYears < years ? { years: { years: years, actual: currentYears } } : null;
    };
}
