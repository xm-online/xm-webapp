import { InjectionToken } from '@angular/core';

export interface BoolOptions {
    true: string;
    false: string;
}

export const XM_BOOL_VIEW_ICONS: InjectionToken<BoolOptions> = new InjectionToken<BoolOptions>('XM_BOOL_VIEW_ICONS');
