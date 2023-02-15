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
        let currentYears = today.getFullYear() - date.getFullYear();
        if (date.getMonth() > today.getMonth()) {
            currentYears--;
        }
        else {
            if (date.getMonth() === today.getMonth()) {
                if (date.getDate() > today.getDate()) {
                    currentYears--;
                }
            }
        }
        return !isNaN(currentYears) && currentYears < years ? { years: { years: years, actual: currentYears } } : null;
    };
}
