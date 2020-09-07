import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ColorSchemeService {
    public remove(): void {
        const existingLinkElement = getExistingColorSchemeElementByKey();
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }

    public set(value: 'normal' | 'dark light'): void {
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
