// Intefaces in this file taken from sweetalert
import { Translate } from '@xm-ngx/translation';

export type XmAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export enum XmAlertDismissReason {
    cancel,
    backdrop,
    close,
    esc,
    timer,
}

export interface XmAlertOptions {
    type?: string;
    input?: string;
    icon?: XmAlertIcon | string;
    title?: string;
    text?: Translate;
    html?: string;
    width?: string;
    textOptions?: {
        value?: string;
        [value: string]: string | object;
    };
    inputOptions?: object;
    titleOptions?: object;

    focusCancel?: boolean;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    confirmButtonClass?: string;

    cancelButtonText?: string;
    showCloseButton?: boolean;
    showCancelButton?: boolean;

    // Not used in material dialog
    buttonsStyling?: boolean;
    customClass?: {
        input?: string;
        confirmButton?: string;
        cancelButton?: string;
    },

    inputValidator?: Function;
}

export interface XmAlertResult<T = any> {
    readonly isConfirmed: boolean;
    readonly isDenied: boolean;
    readonly isDismissed: boolean;
    readonly value?: T;
    readonly dismiss?: XmAlertDismissReason;
}

