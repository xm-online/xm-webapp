// Intefaces in this file taken from sweetalert
import { XmAlertConfig } from './xm-alert.interface';

export type XmAlertDismissReason = 
    'cancel' |
    'backdrop' |
    'close' |
    'esc' |
    'timer';

// For compatibility
export interface XmAlertOptions extends XmAlertConfig {
    /**
     * @deprecated
     * Not using in material dialog
     */
    type?: string;
    /**
     * @deprecated
     * Not using in material dialog
     */
    input?: string;
    /**
     * @deprecated
     * Not using in material dialog
     */
    textOptions?: {
        value?: string;
        [value: string]: string | object;
    };
    /**
     * @deprecated
     * Not using in material dialog
     */
    inputOptions?: object;
    /**
     * @deprecated
     * Not using in material dialog
     */
    titleOptions?: object;
    /**
     * @deprecated
     * Not using in material dialog
     */
    focusCancel?: boolean;
    /**
     * @deprecated
     * Not using in material dialog
     */
    confirmButtonClass?: string;
    /**
     * @deprecated
     * Not using in material dialog
     */
    cancelButtonClass?: string;
    /**
     * @deprecated
     * Not using in material dialog
     */
    buttonsStyling?: boolean;
    /**
     * @deprecated
     * Not using in material dialog
     */
    customClass?: {
        input?: string;
        confirmButton?: string;
        cancelButton?: string;
    },
    /**
     * @deprecated
     * Not using in material dialog
     */
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

