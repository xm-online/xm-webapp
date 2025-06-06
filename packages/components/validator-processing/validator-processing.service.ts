import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import {
    XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    XmControlErrorsTranslates,
} from '@xm-ngx/components/control-error';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import * as _ from 'lodash';
import Ajv from 'ajv';
import { get } from 'lodash';


/***
 * Extends validators
 * ***/
export const XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES: XmControlErrorsTranslates = {
    ...XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    minDate: marker('xm-validator-processing.validators.minDate'),
    languageRequired: marker('xm-validator-processing.validators.languageRequired'),
    minArrayLength: marker('xm-validator-processing.validators.minArrayLength'),
    dateMoreThanIn: marker('xm-validator-processing.validators.dateLessOrEqual'),
    valueLessThanIn: marker('xm-validator-processing.validators.valueLessThanIn'),
    valueMoreThanIn: marker('xm-validator-processing.validators.valueMoreThanIn'),
    severalEmails: marker('xm-validator-processing.validators.severalEmails'),
};

export interface ValidatorProcessingOption {
    type: string;
    params?: unknown;
}

@Injectable({providedIn: 'root'})
export class ValidatorProcessingService {

    private validators: { [key: string]: (...args: any[]) => ValidatorFn } = {
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
        dateMoreThanIn: ValidatorProcessingService.dateMoreThanIn,
        valueLessThanIn: ValidatorProcessingService.valueLessThanIn,
        valueMoreThanIn: ValidatorProcessingService.valueMoreThanIn,
        severalEmails: ValidatorProcessingService.severalEmails,
        requiredDates: ValidatorProcessingService.dateFieldsRequired,
    };

    private asyncValidators: { [key: string]: (...args: any[]) => AsyncValidatorFn } = {
        fileDataSpec: ValidatorProcessingService.fileDataSpec,
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

    public static dateFieldsRequired(value: any): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control?.value) {
                return {required: true};
            }
            if (!control?.value?.from || !control?.value?.to) {
                return {required: true};
            }
            return null;
        };
    }

    public static fileDataSpec(options: {
        path?: string,
        schema: object,
    }): AsyncValidatorFn {
        return async (control: AbstractControl<FileList>) => {
            const files = Array.from(control.value);

            // Skip validators until selected files
            if (files.length == 0) {
                return Promise.resolve(null);
            }

            const jsonFiles = await Promise.allSettled(files.map(file => new Response(file).json()));
            const parsedJsonFiles = jsonFiles
                .filter((p): p is PromiseFulfilledResult<unknown> => p.status === 'fulfilled')
                .map(p => p.value);
            const failedJsonFiles = jsonFiles.filter((p): p is PromiseRejectedResult => p.status === 'rejected');

            if (failedJsonFiles.length > 0) {
                return {
                    'fileDataSpec': true,
                };
            }

            const validate = new Ajv().compile(options?.schema ?? {});

            const valid = parsedJsonFiles.some((value) => {
                const data = _.get(value, options?.path ?? null, value);

                return validate(data);
            });

            return valid ? null : {
                fileDataSpec: true,
            };
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

    public static valueMoreThanIn(params: string | { name: string, offset: number }): ValidatorFn | null {
        return (control: AbstractControl) => {
            const controlName = typeof params === 'string' ? params : params?.name;
            if (!control.value) {
                return null;
            }
            let compareValue = _.get(control?.parent?.value, controlName) ?? 0;
            const isNumber = Number.isInteger(Math.round(compareValue));
            if (!isNumber) {
                compareValue = new Date(compareValue);
            }
            if (typeof params === 'object' && params?.offset) {
                if (typeof params !== 'string') {
                    compareValue = new Date(compareValue.getTime() + params.offset);
                }
            }

            if (compareValue && control?.value > compareValue) {
                return {
                    valueMoreThanIn: {
                        controlName,
                        compareValue: !isNumber ? compareValue.toISOString().split('T')[0] : compareValue,
                    },
                };
            }
            _.get(control?.parent?.controls, controlName)?.setErrors(null);
            return null;
        };
    }

    public static valueLessThanIn(params: string | { name: string, offset: number }): ValidatorFn | null {
        return (control: AbstractControl) => {
            const controlName = typeof params === 'string' ? params : params?.name;
            if (!control.value) {
                return null;
            }
            let compareValue = _.get(control?.parent?.value, controlName) ?? 0;
            const isNumber = Number.isInteger(Math.round(compareValue));

            if (!isNumber) {
                compareValue = new Date(compareValue);
            }

            if (typeof params === 'object' && params?.offset) {
                if (typeof params !== 'string') {
                    compareValue = new Date(compareValue.getTime() + params.offset);
                }
            }

            if (compareValue && control?.value < compareValue) {
                return {
                    valueLessThanIn: {
                        controlName,
                        compareValue: !isNumber ? compareValue.toISOString().split('T')[0] : compareValue,
                    },
                };
            }
            _.get(control?.parent?.controls, controlName)?.setErrors(null);
            return null;
        };
    }

    public static dateMoreThanIn(params: string | { name: string, offset: number }): ValidatorFn | null {
        return (control: AbstractControl) => {
            const controlName = typeof params === 'string' ? params : params?.name;
            const valueToCompare = get(control?.parent?.value, controlName);
            const value = control.value;
            if (!value || !valueToCompare) {
                return null;
            }

            let compareDateValue = new Date(valueToCompare);
            if (typeof params === 'object' && params?.offset) {
                if (typeof params !== 'string') {
                    compareDateValue = new Date(compareDateValue.getTime() + params.offset);
                }
            }

            if (value <= compareDateValue) {
                return {
                    dateMoreThanIn: {
                        controlName,
                        compareValue: compareDateValue.toISOString().split('T')[0],
                    },
                };
            }
            return null;
        };
    }

    public static severalEmails(): ValidatorFn | null {
        return (control: AbstractControl) => {
            if (!control?.value) {
                return null;
            }

            const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            const separator = ';';
            const emails = control.value?.split(separator);
            const isAllEmailsValid = emails.every(item => emailPattern.test(item.trim()));

            if (!isAllEmailsValid) {
                return {
                    severalEmails: true,
                };
            }

            return null;
        };
    }

    public asyncValidatorFactory(option: ValidatorProcessingOption): AsyncValidatorFn | null {
        const validator = this.asyncValidators[option.type] || null;
        return (validator && option.params) ? (validator as any)(option.params) : validator();
    }

    public asyncValidatorsFactory(options: ValidatorProcessingOption[]): AsyncValidatorFn[] {
        if (!options) {
            return [];
        }
        return options.map(option => this.asyncValidatorFactory(option)).filter((v) => Boolean(v));
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
}
