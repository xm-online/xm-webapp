import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import { ValidatorProcessingOption } from '@xm-ngx/components/validator-processing';

export interface XmConfirmDialogOptions {
    [key: string]: unknown;
    validators?: ValidatorProcessingOption[];
    asyncValidators?: ValidatorProcessingOption[];
}

export interface XmConfirmDialogControlDef<V = unknown, O = XmConfirmDialogOptions> extends XmDynamicPresentation<V, O> {
    selector: string;
    class?: string;
    style?: string;
}

export interface XmConfirmDialogConditionModel {
    [key: string]: {
        value: unknown,
        valid: boolean;
        disabled: boolean;
    }
}

export interface XmConfirmDialogGroup {
    type: string;
    condition?: string;
    permission?: boolean | string | string[],
    control: XmConfirmDialogControlDef;
}

export type XmConfirmDialogControls = XmConfirmDialogGroup[];

export interface XmConfirmDialogData {
    title?: Translate;
    subtitle?: Translate;
    cancelButtonText?: Translate;
    confirmButtonText?: Translate;
    controls?: XmConfirmDialogControls;
}
