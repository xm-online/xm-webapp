// Intefaces in this file taken from sweetalert
import { XmAlertConfig } from './xm-alert.interface';

export type XmAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export type XmAlertDismissReason = 
    'cancel' |
    'backdrop' |
    'close' |
    'esc' |
    'timer';

// For compatibility
export interface XmAlertOptions extends XmAlertConfig {
    type?: string;
    input?: string;
    icon?: XmAlertIcon | string;
    textOptions?: {
        value?: string;
        [value: string]: string | object;
    };
    inputOptions?: object;
    titleOptions?: object;
    focusCancel?: boolean;
    showCloseButton?: boolean;
    confirmButtonClass?: string;
    cancelButtonClass?: string;
    buttonsStyling?: boolean;
    customClass?: {
        input?: string;
        confirmButton?: string;
        cancelButton?: string;
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    inputValidator?: Function;
}

export interface XmAlertResult<T = any> {
    readonly isConfirmed: boolean;
    readonly isDenied: boolean;
    readonly isDismissed: boolean;
    readonly value?: T;
    readonly dismiss?: XmAlertDismissReason;
}

