import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Form multi-control validator, validates controls values to be unique.
 */
export function uniqueFieldsValidator(fieldNames: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        if (!(formGroup instanceof FormGroup)) {
            return null;
        }

        const values: string[] = [];
        const controls = [];

        fieldNames.forEach(name => {
            const fieldControl = formGroup.get(name);
            if (fieldControl) {
                const value = fieldControl.value;
                const trimmedValue = typeof value === 'string' ? value.trim() : value;

                controls.push({ name, value: trimmedValue, control: fieldControl });

                if (trimmedValue) {
                    values.push(trimmedValue);
                }
            }
        });

        const uniqueValues = new Set(values);
        const formHasDuplicates = uniqueValues.size !== values.length;

        controls.forEach(c => {
            const controlRef = c.control;
            const currentErrors = controlRef.errors || {};

            let newErrors: ValidationErrors = { ...currentErrors };
            delete newErrors['notUnique'];

            if (!c.value) {
                controlRef.setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
                return;
            }

            const isDuplicate = values.filter(v => v === c.value).length > 1;

            if (isDuplicate) {
                newErrors = {
                    ...newErrors,
                    notUnique: { message: 'The value must be unique.' },
                };
                controlRef.setErrors(newErrors);
            } else {
                controlRef.setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
            }
        });

        return formHasDuplicates ? { notUniqueGroup: true } : null;
    };
}
