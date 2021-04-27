import { InjectionToken } from '@angular/core';

export interface XmBoolOptions {
    true: string;
    false: string;
}

export const XM_BOOL_VIEW_ICONS: InjectionToken<XmBoolOptions> = new InjectionToken<XmBoolOptions>('XM_BOOL_VIEW_ICONS');
