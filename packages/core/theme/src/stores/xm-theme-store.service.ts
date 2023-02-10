import { Injectable } from '@angular/core';
import { XM_THEME_KEY } from '@xm-ngx/components/switch-theme-widget';
import { XmTheme } from '../interfaces/xm.theme';


@Injectable({
    providedIn: 'root',
})
/**
 * Stores an active theme.
 * @beta
 */
export class XmThemeStore {
    public get(): XmTheme | null {
        const item = localStorage.getItem(XM_THEME_KEY);
        if (!item) {
            return null;
        }
        return JSON.parse(item) || null;
    }

    public set(theme: XmTheme): void {
        localStorage.setItem(XM_THEME_KEY, JSON.stringify(theme));
    }
}
