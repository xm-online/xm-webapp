import {UntypedFormControl} from '@angular/forms';
import {ValidatorProcessingOption} from '@xm-ngx/components/validator-processing';
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
    fields: FormFieldLayoutConfig[],
    updateData?: boolean;
    saveData?: boolean;
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
    dataQa?: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};

export type FormGroupFields = Record<string, UntypedFormControl>;
