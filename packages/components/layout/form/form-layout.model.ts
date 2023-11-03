import { UntypedFormControl } from '@angular/forms';
import { ValidatorProcessingOption } from '@xm-ngx/components/validator-processing';
import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { JavascriptCode, XmConfig } from '@xm-ngx/interfaces';

export type FormLayoutConfig = {
    fields: FormFieldLayoutConfig[],
};

export type FormFieldLayoutConfig = {
    property: string,
    condition: JavascriptCode;
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
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};

export type FormGroupFields = Record<string, UntypedFormControl>;