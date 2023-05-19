import { Injectable } from '@angular/core';
import { XmTheme } from '../interfaces/xm.theme';

export const XM_THEME_KEY = 'XM_SWITCH_THEME_KEY';

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
