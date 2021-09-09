import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
    XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    XmControlErrorsTranslates,
} from '@xm-ngx/components/control-error/xm-control-errors-translates';


/***
 * Extends validators
 * ***/
export const XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES: XmControlErrorsTranslates = {
    ...XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
};

export interface ValidatorProcessingOption {
    type: string;
    params?: unknown;
}

@Injectable({providedIn: 'root'})
export class ValidatorProcessingService {

    private validators: {[key: string]: (...args: any[]) => ValidatorFn | ValidationErrors} = {
        languageRequired: ValidatorProcessingService.languageRequired,
        minArrayLength: ValidatorProcessingService.minArrayLength,
        pattern: Validators.pattern,
        required: Validators.required,
        email: Validators.email,
        minLength: Validators.minLength,
        max: Validators.max,
        min: Validators.min,
        maxLength: Validators.maxLength,
        minDate: ValidatorProcessingService.minDate,
        valueLessThanIn: ValidatorProcessingService.valueLessThanIn,
        valueMoreThanIn: ValidatorProcessingService.valueMoreThanIn,
    };

    public static languageRequired(languages: string[]): ValidatorFn {
        return (control: AbstractControl) => {
            const invalidLanguages = languages.filter(lng => {
                if (!control.value) {
                    return true;
                }
                const languageValue = control.value.find(v => v?.languageKey === lng);
                return !languageValue || !languageValue.name;
            });

            return invalidLanguages.length > 0
                ? {languageRequired: invalidLanguages}
                : null;
        };
    }

    public static minArrayLength(minLength: number): ValidatorFn {
        return (control: AbstractControl) => {
            function isEmptyInputValue(value: any): boolean {
                return value == null || value.length === 0;
            }

            if (isEmptyInputValue(control.value)) {
                return null;
            }

            const length: number = control.value ? control.value.length : 0;
            return length < minLength
                ? {minArrayLength: {requiredLength: minLength, actualLength: length}}
                : null;
        };
    }

    public static minDate(options: {type: 'TODAY' | 'TOMORROW'}): ValidatorFn {
        return (control: AbstractControl) => {
            function isEmptyInputValue(value: any): boolean {
                return value == null || value.length === 0;
            }

            if (isEmptyInputValue(control.value)) {
                return null;
            }
            let date: Date;
            if (options.type === 'TODAY') {
                date = new Date();
                date.setHours(0, 0, 0, 0);
            } else if (options.type === 'TOMORROW') {
                date = new Date();
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 1);
            }
            const length: number = control.value ? control.value?.getTime() : 0;
            return length < date.getTime()
                ? {minDate: {minDate: date, actualDate: control.value, minDateI18n: date.toISOString().split('T')[0]}}
                : null;
        };
    }

    public static valueMoreThanIn(controlName: string): ValidatorFn | null {
        return (control: AbstractControl) => {
            const compareValue = control?.parent?.get(controlName)?.value;
            if(compareValue !== '' && control?.value > compareValue) {
                return {
                    valueMoreThanIn: {
                        controlName,
                    },
                };
            }
            control?.parent?.get(controlName)?.setErrors(null);
            return null;
        };
    }

    public static valueLessThanIn(controlName: string): ValidatorFn | null {
        return (control: AbstractControl) => {
            const compareValue = control?.parent?.get(controlName)?.value;
            if(compareValue !== '' && control?.value < compareValue) {
                return {
                    valueLessThanIn: {
                        controlName,
                    },
                };
            }
            control?.parent?.get(controlName)?.setErrors(null);
            return null;
        };
    }

    public validatorFactory(option: ValidatorProcessingOption): ValidatorFn | null {
        const validator = this.validators[option.type] || null;
        return (validator && option.params) ? (validator as any)(option.params) : validator;
    }

    public validatorsFactory(options: ValidatorProcessingOption[]): ValidatorFn[] {
        if (!options) {
            return [];
        }
        return options.map(option => this.validatorFactory(option)).filter((v) => Boolean(v));
    }

}
