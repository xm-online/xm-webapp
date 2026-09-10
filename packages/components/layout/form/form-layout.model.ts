import {UntypedFormControl} from '@angular/forms';
import {ValidatorProcessingOption} from '@xm-ngx/components/validator-processing';
import { EDIT_STATE } from '@xm-ngx/controllers/features/edit-state-store';
import {XmDynamicControllerDeclaration} from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import {JavascriptCode, XmConfig} from '@xm-ngx/interfaces';

export type FormLayoutConfig = {
    controller?: {
        key: string;
        getDataMethod: string;
        saveDataMethod: string;
        updateDataMethod: string;
        resetDataMethod: string;
    };
    defaultEditState: EDIT_STATE,
    fields: FormFieldLayoutConfig[],
    updateData?: boolean;
    ignoreFormValidationToUpdate?: boolean;
    saveData?: boolean;
};

/**
 * @example
 * ```json
 * {
 *   "property": "data.smsEnabled",
 *   "condition": "true",
 *   "rules": [
 *     {
 *       "when": "form['data.smsEnabled'] !== true",
 *       "set": {
 *         "data.smsTemplate": "undefined",
 *         "data.smsTemplateId": "undefined"
 *       }
 *     },
 *     {
 *       "when": "form['data.smsEnabled'] === true",
 *       "set": {
 *         "data.smsTemplateId": "form['data.smsTemplate']?.id != null ? String(form['data.smsTemplate'].id) : undefined"
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export type FormFieldRule = {
    /**
     * Optional JS-condition deciding whether this rule runs.
     * Evaluated with `form` and `dataValue` in scope; omit to always run.
     *
     * @example `"form['data.smsEnabled'] === true"`
     */
    when?: JavascriptCode;
    /**
     * Map of target field `property` to a JS value expression.
     * Each expression is evaluated with `form` and `dataValue` in scope and written into
     * the matching form control. Use `"undefined"` to clear a value.
     *
     * @example
     * ```json
     * { "data.smsTemplateId": "String(form['data.smsTemplate']?.id)" }
     * ```
     */
    set: Record<string, JavascriptCode>;
};

export type FormFieldLayoutConfig = {
    property: string,
    condition: JavascriptCode;
    /**
     * Declarative cross-field rules applied on form value changes.
     * See {@link FormFieldRule} for the evaluation context and examples.
     */
    rules?: FormFieldRule[];
    defaultValue?: unknown;
    defaultDisabled?: boolean;
    validators?: ValidatorProcessingOption[];
    asyncValidators?: ValidatorProcessingOption[];
    layout: DynamicLayoutConfig
}

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerDeclaration[],
    selector: string;
    dataQa?: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};

export type FormGroupFields = Record<string, UntypedFormControl>;
