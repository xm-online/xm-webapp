import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import {
    ValidatorProcessingOption,
    ValidatorProcessingService,
} from '@xm-ngx/components/validator-processing';
import { fromPairs } from 'lodash/fp';


export interface FormGroupLayoutItem<V = unknown, C = unknown> extends XmDynamicPresentation<V, C> {
    /** Uniq name for filters */
    name?: string;
    /** Control validators */
    validators?: ValidatorProcessingOption[];
    disabled?: boolean;
    isArray?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class FormGroupLayoutFactoryService {

    constructor(
        private validatorProcessingService: ValidatorProcessingService,
        private formBuilder: UntypedFormBuilder,
    ) {
    }

    public createControl(option: FormGroupLayoutItem): UntypedFormControl {
        const syncValidators = this.validatorProcessingService.validatorsFactory(option.validators);
        const control = new UntypedFormControl(option.value, syncValidators);
        if (option.disabled) {
            control.disable();
        }
        return control;
    }

    public createForm(options: FormGroupLayoutItem[]): UntypedFormGroup {
        const controls = options.map((option: FormGroupLayoutItem) => {
            const form: UntypedFormArray | UntypedFormControl = option.isArray ?
                this.formBuilder.array([]) : this.createControl(option);
            return [option.name, form];
        });
        return this.formBuilder.group(fromPairs(controls));
    }

    public createFormWithFormArray(options: FormGroupLayoutItem[]): UntypedFormGroup {
        return this.formBuilder.group({ aliases: this.createFormArray(options) });
    }

    private createFormArray(options: FormGroupLayoutItem[]): UntypedFormArray {
        const controls = options.map((layoutItem) => this.createControl(layoutItem));
        return this.formBuilder.array(controls);
    }

    public createBasicFormGroup(options: FormGroupLayoutItem[]): UntypedFormGroup {
        const controls = options.reduce((accumulator, currentValue) => {
            return {
                ...accumulator,
                [currentValue.name]: this.formBuilder.control(''),
            };
        }, {});
        return this.formBuilder.group(controls);
    }
}
