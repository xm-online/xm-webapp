import { Translate } from '@xm-ngx/translation';

export interface XmAlertConfig {
    width?: string;
    text?: Translate;
    html?: Translate;
    title?: Translate;
    aboveTitle?: Translate;
    belowTitle?: Translate;
    center?: boolean;
    icon?: string;
    iconColor?: string;
    imageUrl?: string;
    imageWidth?: string;
    imageHeight?: string;
    dialogActionsAlign?: 'start' | 'center' | 'end',
    showCloseButton?: boolean;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    confirmButtonText?: Translate;
    cancelButtonText?: Translate;
    className?: string;
}