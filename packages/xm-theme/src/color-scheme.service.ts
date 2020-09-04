import { Injectable } from '@angular/core';
import { compact } from 'lodash';

@Injectable({ providedIn: 'root' })
export class ColorSchemeService {
    public remove(): void {
        const existingLinkElement = getExistingColorSchemeElementByKey();
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }

    public set(dark: boolean, light: boolean): void {
        const value = compact([
            dark ? 'dark' : '',
            light ? 'light' : '',
        ]).join(' ');
        getColorSchemeElementForKey().setAttribute('content', value);
    }
}

function getColorSchemeElementForKey(): HTMLMetaElement {
    return getExistingColorSchemeElementByKey() || createColorSchemeElementWithKey();
}

function getExistingColorSchemeElementByKey(): HTMLMetaElement {
    return document.head.querySelector(`meta[name="color-scheme"]`);
}

function createColorSchemeElementWithKey(): HTMLMetaElement {
    const el = document.createElement('meta');
    el.setAttribute('name', 'color-scheme');
    document.head.appendChild(el);
    return el;
}
