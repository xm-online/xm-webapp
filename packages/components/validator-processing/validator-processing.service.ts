import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import {
    XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    XmControlErrorsTranslates,
} from '@xm-ngx/components/control-error/xm-control-errors-translates';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';


/***
 * Extends validators
 * ***/
export const XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES: XmControlErrorsTranslates = {
    ...XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    minDate: marker('xm-validator-processing.validators.minDate'),
    languageRequired: marker('xm-validator-processing.validators.languageRequired'),
    minArrayLength: marker('xm-validator-processing.validators.minArrayLength'),
    valueLessThanIn: marker('xm-validator-processing.validators.valueLessThanIn'),
    valueMoreThanIn: marker('xm-validator-processing.validators.valueMoreThanIn'),
    severalEmails: marker('xm-validator-processing.validators.severalEmails'),
    dateLessThanIn: marker('xm-control-errors.validators.pattern'),
    dateMoreThanIn: marker('xm-control-errors.validators.pattern'),
};

export interface ValidatorProcessingOption {
    type: string;
    params?: unknown;
}

@Injectable({providedIn: 'root'})
export class ValidatorProcessingService {

    private validators: {[key: string]: (...args: any[]) => ValidatorFn} = {
        languageRequired: ValidatorProcessingService.languageRequired,
        minArrayLength: ValidatorProcessingService.minArrayLength,
        pattern: Validators.pattern,
        required: () => Validators.required,
        email: () => Validators.email,
        minLength: Validators.minLength,
        max: Validators.max,
        min: Validators.min,
        maxLength: Validators.maxLength,
        minDate: ValidatorProcessingService.minDate,
        valueLessThanIn: ValidatorProcessingService.valueLessThanIn,
        valueMoreThanIn: ValidatorProcessingService.valueMoreThanIn,
        severalEmails: ValidatorProcessingService.severalEmails,
        dateMoreThanIn: ValidatorProcessingService.dateMoreThanIn,
        dateLessThanIn: ValidatorProcessingService.dateLessThanIn,
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

    public static minDate(options: {
        type?: 'TOMORROW',
        days?: number,
    }): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }

            const date = new Date();
            date.setHours(0, 0, 0, 0);

            if (options.type === 'TOMORROW') { // TODO: remove this condition and refactor if don`t using
                date.setDate(date.getDate() + 1);
            } else {
                date.setDate(date.getDate() + options.days);
            }

            const controlValueTime: number = new Date(control.value)?.getTime();
            return controlValueTime < date.getTime() ?
                {
                    minDate: {
                        minDate: date,
                        actualDate: control.value,
                        minDateI18n: date.toISOString().split('T')[0],
                    },
                } :
                null;
        };
    }

    public static valueMoreThanIn(controlName: string): ValidatorFn | null {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            let compareValue = control?.parent?.value[controlName] ?? 0;
            const isNumber = Number.isInteger(compareValue);
            if(!isNumber) {
                compareValue = new Date(compareValue);
            }

            if(compareValue && control?.value > compareValue) {
                return {
                    valueMoreThanIn: {
                        controlName,
                        compareValue: !isNumber ? compareValue.toISOString().split('T')[0] : compareValue,
                    },
                };
            }
            control?.parent?.controls[controlName]?.setErrors(null);
            return null;
        };
    }

    public static valueLessThanIn(controlName: string): ValidatorFn | null {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            let compareValue = control?.parent?.value[controlName] ?? 0;
            const isNumber = Number.isInteger(compareValue);

            if(!isNumber) {
                compareValue = new Date(compareValue);
            }

            if(compareValue && control?.value < compareValue) {
                return {
                    valueLessThanIn: {
                        controlName,
                        compareValue: !isNumber ? compareValue.toISOString().split('T')[0] : compareValue,
                    },
                };
            }
            control?.parent?.controls[controlName]?.setErrors(null);
            return null;
        };
    }

    public static dateMoreThanIn(options: {
        controlName: string,
        assignError?: string,
    }): ValidatorFn | null {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            const compareValue = control?.parent?.value[options?.controlName] ?? 0;
            const compareControl = control?.parent?.controls[options?.controlName];
            const controlDate = ValidatorProcessingService.formatToDateTime(control?.value);
            const compareDate = ValidatorProcessingService.formatToDateTime(compareValue);

            if(compareValue && controlDate > compareDate) {
                if(!options.assignError) {
                    return {
                        dateMoreThanIn: true,
                    };
                }
                compareControl?.setErrors({
                    [options.assignError]: true,
                });
            } else {
                compareControl?.setErrors(null);
            }
            return null;
        };
    }

    public static dateLessThanIn(options: {
        controlName: string,
        assignError?: string,
    }): ValidatorFn | null {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            const compareValue = control?.parent?.value[options?.controlName] ?? 0;
            const compareControl = control?.parent?.controls[options?.controlName];
            const controlDate = ValidatorProcessingService.formatToDateTime(control?.value);
            const compareDate = ValidatorProcessingService.formatToDateTime(compareValue);

            if(compareValue && controlDate < compareDate) {
                if(!options.assignError) {
                    return {
                        dateLessThanIn: true,
                    };
                }
                compareControl?.setErrors({
                    [options.assignError]: true,
                });
            } else {
                compareControl?.setErrors(null);
            }
            return null;
        };
    }

    public static severalEmails(): ValidatorFn | null {
        return (control: AbstractControl) => {
            if(!control?.value) {
                return null;
            }

            const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            const separator = ';';
            const emails = control.value?.split(separator);
            const isAllEmailsValid = emails.every(item => emailPattern.test(item.trim()));

            if(!isAllEmailsValid) {
                return {
                    severalEmails: true,
                };
            }

            return null;
        };
    }

    public validatorFactory(option: ValidatorProcessingOption): ValidatorFn | null {
        const validator = this.validators[option.type] || null;
        return (validator && option.params) ? (validator as any)(option.params) : validator();
    }

    public validatorsFactory(options: ValidatorProcessingOption[]): ValidatorFn[] {
        if (!options) {
            return [];
        }
        return options.map(option => this.validatorFactory(option)).filter((v) => Boolean(v));
    }

    private static formatToDateTime(value: string | Date): number {
        return Number.isInteger(value) ?
            new Date().setDate(new Date().getDate() + Number(value)) :
            new Date(value).getTime();
    }
}
