/**
 * Security hardening: hides version information exposed on the global `window`
 * object by Angular and third-party libraries.
 *
 * Motivation: version fingerprinting allows attackers to look up known CVEs
 * for a specific library version. Removing these global markers reduces the
 * attack surface without affecting application runtime behaviour.
 *
 * Covered libraries:
 *   Angular, Bootstrap, DataTables, jQuery, Leaflet, Livefyre,
 *   Lodash, Moment.js, Ace, Underscore.js
 */

import { APP_INITIALIZER, Provider } from '@angular/core';

type AnyObject = Record<string, any>;

/**
 * Attempts to remove a property from `obj`.
 * Falls back to redefining it as a non-enumerable getter returning `undefined`
 * when the descriptor is non-configurable (so it cannot be deleted outright).
 */
function eraseVersion(obj: AnyObject, prop: string): void {
    if (!obj || !(prop in obj)) {
        return;
    }
    try {
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        if (descriptor?.configurable === false) {
            Object.defineProperty(obj, prop, {
                get: () => undefined,
                enumerable: false,
                configurable: false,
            });
        } else {
            delete obj[prop];
        }
    } catch {
        // Some host environments disallow property deletion – silently ignore.
    }
}

/** Removes the Angular debug-tools namespace that leaks the framework version. */
function hideAngularVersion(global: AnyObject): void {
    // `window.ng` is injected by Angular in non-production builds and exposes
    // `ng.version`, `ng.getComponent`, etc.
    eraseVersion(global, 'ng');
    eraseVersion(global, 'getAllAngularRootElements');
}

/**
 * Removes `jQuery.fn.jquery` (the version string) and `Constructor.VERSION`
 * properties attached by Bootstrap plugins.
 */
function hideJQueryAndBootstrapVersions(global: AnyObject): void {
    const JQUERY_GLOBALS = ['jQuery', '$', 'jquery'] as const;
    const BOOTSTRAP_PLUGINS = [
        'tooltip', 'popover', 'modal', 'dropdown',
        'collapse', 'carousel', 'button', 'alert', 'tab', 'scrollspy',
    ] as const;

    for (const key of JQUERY_GLOBALS) {
        const jq: AnyObject | undefined = global[key];
        if (!jq) {
            continue;
        }

        // jQuery version string
        eraseVersion(jq, 'fn.jquery' as any);
        try { eraseVersion(jq.fn as AnyObject, 'jquery'); } catch { /* noop */ }

        // Bootstrap 3/4 attach VERSION to each plugin constructor
        for (const plugin of BOOTSTRAP_PLUGINS) {
            try {
                const fn = (jq.fn as AnyObject)[plugin];
                if (fn?.Constructor) {
                    eraseVersion(fn.Constructor as AnyObject, 'VERSION');
                }
            } catch { /* noop */ }
        }

        // DataTables
        try {
            const dt = (jq.fn as AnyObject)['dataTable'];
            if (dt) {
                eraseVersion(dt as AnyObject, 'version');
                if (dt.ext) {
                    eraseVersion(dt.ext as AnyObject, 'sVersion');
                }
            }
        } catch { /* noop */ }
    }
}

/** Removes version properties from Lodash and Underscore.js globals. */
function hideLodashUnderscoreVersions(global: AnyObject): void {
    for (const key of ['_', 'lodash', 'underscore']) {
        const lib: AnyObject | undefined = global[key];
        if (lib) {
            eraseVersion(lib, 'VERSION');
        }
    }
}

/** Removes the `moment.version` string. */
function hideMomentVersion(global: AnyObject): void {
    const moment: AnyObject | undefined = global['moment'];
    if (moment) {
        eraseVersion(moment, 'version');
    }
}

/** Removes the Leaflet `L.version` string. */
function hideLeafletVersion(global: AnyObject): void {
    const L: AnyObject | undefined = global['L'];
    if (L) {
        eraseVersion(L, 'version');
    }
}

/** Removes the Ace editor version string. */
function hideAceVersion(global: AnyObject): void {
    const ace: AnyObject | undefined = global['ace'];
    if (ace) {
        eraseVersion(ace, 'version');
    }
}

/** Removes known Livefyre version markers. */
function hideLivefyreVersion(global: AnyObject): void {
    for (const key of ['Livefyre', 'fyre', 'LF']) {
        const lib: AnyObject | undefined = global[key];
        if (lib) {
            eraseVersion(lib, 'version');
            eraseVersion(lib, 'VERSION');
        }
    }
}

/**
 * Removes the `ng-version` attribute that Angular stamps onto the root
 * component's host element during bootstrap (after APP_INITIALIZER resolves).
 *
 * A MutationObserver is used because the attribute is written asynchronously —
 * after all initializers complete — so it cannot be removed synchronously at
 * startup. The observer disconnects itself as soon as all matching attributes
 * are erased, leaving no runtime overhead.
 */
function hideNgVersionDomAttribute(): void {
    /** Strip the attribute from every element that currently carries it. */
    function purgeExisting(): void {
        document.querySelectorAll('[ng-version]').forEach(el => el.removeAttribute('ng-version'));
    }

    // Remove any instances already present in the DOM (edge case: SSR hydration).
    purgeExisting();

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        let found = false;

        for (const mutation of mutations) {
            // Direct attribute mutation on an existing element.
            if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'ng-version' &&
                mutation.target instanceof Element
            ) {
                mutation.target.removeAttribute('ng-version');
                found = true;
            }

            // New nodes inserted into the DOM that already carry the attribute.
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof Element) {
                        if (node.hasAttribute('ng-version')) {
                            node.removeAttribute('ng-version');
                            found = true;
                        }
                        // Also sweep descendants (e.g. when a subtree is inserted at once).
                        node.querySelectorAll('[ng-version]').forEach(el => {
                            el.removeAttribute('ng-version');
                            found = true;
                        });
                    }
                });
            }
        }

        // Once Angular has bootstrapped and we've cleaned up, no further
        // observation is needed — disconnect to free resources.
        if (found) {
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['ng-version'],
        childList: true,
        subtree: true,
    });
}

/**
 * Runs all version-erasure routines against the browser `window` object.
 * Safe to call multiple times – each routine is idempotent.
 */
export function hideLibraryVersions(): void {
    const global = window as unknown as AnyObject;

    hideAngularVersion(global);
    hideJQueryAndBootstrapVersions(global);
    hideLodashUnderscoreVersions(global);
    hideMomentVersion(global);
    hideLeafletVersion(global);
    hideAceVersion(global);
    hideLivefyreVersion(global);
    hideNgVersionDomAttribute();
}

/**
 * `APP_INITIALIZER` factory — returns the version-hiding function so Angular
 * executes it during the application bootstrap phase, before any view renders.
 */
export function hideVersionsInitializerFactory(): () => void {
    return hideLibraryVersions;
}

/**
 * Drop-in provider. Add to the `providers` array of the root `NgModule`
 * (or `bootstrapApplication` call) to activate version hiding at startup.
 *
 * @example
 * providers: [HIDE_VERSIONS_PROVIDER]
 */
export const HIDE_VERSIONS_PROVIDER: Provider = {
    provide: APP_INITIALIZER,
    useFactory: hideVersionsInitializerFactory,
    multi: true,
};


