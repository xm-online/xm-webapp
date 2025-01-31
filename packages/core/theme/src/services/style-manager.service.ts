import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
/**
 * Creates a link tag.
 * @public
 */
export class StyleManagerService {
    public remove(key: string): void {
        const existingLinkElement = getExistingLinkElementByKey(key);
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }

    public set(key: string, href: string): void {
        getLinkElementForKey(key).setAttribute('href', href);
    }

}

function getLinkElementForKey(key: string): HTMLElement {
    return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string): HTMLElement {
    return document.head.querySelector(`link[rel="stylesheet"].${getClassNameForKey(key)}`);
}

function createLinkElementWithKey(key: string): HTMLElement {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(getClassNameForKey(key));
    document.head.appendChild(linkEl);
    return linkEl;
}

function getClassNameForKey(key: string): string {
    return `style-manager-${key}`;
}
