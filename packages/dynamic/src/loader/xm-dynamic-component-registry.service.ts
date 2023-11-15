import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { Dictionary, flatten, keyBy } from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicModuleRegistry } from './xm-dynamic-module-registry.service';
import { NotFoundException } from '@xm-ngx/exceptions';
import { XmDynamicEntryModule } from '../interfaces/xm-dynamic-entry-module';
import { XmDynamicConstructor } from '../interfaces/xm-dynamic-constructor';
import { XmDynamicEntry, XmDynamicSelector } from '../interfaces';

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

export interface XmDynamicComponentRecord<T> {
    componentType: XmDynamicConstructor<T>,
    injector: Injector,
    ngModuleRef: NgModuleRef<unknown> | null
}

@Injectable()
class _XmDynamicComponentRegistry {
    private readonly entries: Dictionary<XmDynamicEntry>;

    constructor(
        moduleRef: NgModuleRef<unknown>
    ) {
        this.entries = this.getEntriesMap(moduleRef.injector);
    }

    private getEntriesMap(injector: Injector): Dictionary<XmDynamicEntry> {
        const entries = injector.get(XM_DYNAMIC_ENTRIES, [[]]);
        const flattened = flatten(flatten(entries));
        return keyBy(flattened, 'selector');
    }

    protected findComponentInRegistry(injector: Injector, selector: string): XmDynamicEntry {
        const dynamicMap = this.getEntriesMap(injector);
        return dynamicMap[selector];
    }

    public contains(selector: string): boolean {
        return !!this.entries[selector];
    }
}

@Injectable()
export class XmDynamicComponentRegistry extends _XmDynamicComponentRegistry {

    private cache: Dictionary<Promise<XmDynamicComponentRecord<unknown>>> = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicModules: XmDynamicModuleRegistry,
    ) {
        super(moduleRef);
    }

    /**
     * @throws NotFoundException
     */
    public find<T>(
        inSelector: XmDynamicSelector,
        injector: Injector = this.moduleRef.injector,
    ): Promise<XmDynamicComponentRecord<T>> {
        const fullSelector = this.simplifyExtSelector(inSelector);
        // TODO: Components are being resolved in any context and cannot be cached
        // if (this.cache[fullSelector]) {
        //     return this.cache[fullSelector] as Promise<XmDynamicComponentRecord<T>>;
        // }

        if (this.isGlobalSelector(fullSelector)) {
            return this.cache[fullSelector] = this.resolveComponent<T>(fullSelector, injector, null);
        }

        if (this.isModuleSelector(fullSelector)) {
            return this.cache[fullSelector] = this.loadModule<T>(fullSelector, injector);
        }

        return this.cache[fullSelector] = this.resolveComponent<T>(fullSelector, injector, null);
    }

    private async loadModule<T>(
        selector: string,
        injector: Injector,
    ): Promise<XmDynamicComponentRecord<T>> {
        const moduleSelector = this.getModuleSelector(selector);
        const ngModuleRef = await this.dynamicModules.find<T>(moduleSelector, injector);
        const restSelector = selector.replace(moduleSelector + '/', '');
        return this.resolveComponent<T>(restSelector, ngModuleRef.injector, ngModuleRef);
    }

    private async resolveComponent<T>(
        selector: XmDynamicSelector,
        injector: Injector,
        ngModuleRef: NgModuleRef<unknown> | null,
    ): Promise<XmDynamicComponentRecord<T>> {

        const componentType = this.handleProviderSolution<T>(selector, injector);
        if (componentType) {
            // eslint-disable-next-line no-console
            console.error(`Deprecated solution. Will be removed in v6.0.0. Use XmDynamicModule.forChild() instead. selector=${selector}.`);
            return {
                injector: injector,
                componentType: componentType,
                ngModuleRef: ngModuleRef,
            };
        }

        const component = this.findComponentInRegistry(injector, selector);
        if (!component) {
            throw new NotFoundException(`
            The component selector='${selector}' is not declared!
            Use XmDynamicModule.forChild(...).`);
        }

        const loaded = await component.loadChildren();

        if (this.isEntryModule(loaded)) {
            const compiledModule = createNgModule<XmDynamicEntryModule<T>>(loaded as Type<XmDynamicEntryModule<T>>, injector);
            if (compiledModule?.instance?.entry) {
                // eslint-disable-next-line no-console
                console.error(`Deprecated solution. Will be removed in v6.0.0. Make selector=${selector} a standalone component`);
                return {
                    componentType: compiledModule.instance.entry,
                    injector: compiledModule.injector,
                    ngModuleRef: compiledModule,
                };
            }
            // Unique case - module loader. Probably it's just for @xm-ngx/dashboard/default-dashboard module
            return {
                componentType: loaded as XmDynamicConstructor<T>,
                injector: compiledModule.injector,
                ngModuleRef: compiledModule,
            };
        }

        // Standalone component.
        return {
            componentType: loaded as XmDynamicConstructor<T>,
            injector: injector,
            ngModuleRef: null,
        };
    }

    private isEntryModule(entry: any): boolean {
        return !!entry?.ɵmod;
    }

    /**
     * @example providers:
     * ```
     * [{ provide: 'my-selector', useValue: MyComponent }]
     * ```
     * @deprecated Angular does not allow search/store something inside injector by string valued key.
     *   deprecated solution. we need to search only by injection token, not random string;
     * Will be removed in v6.0.0.
     */
    private handleProviderSolution<T>(selector: string, injector: Injector): XmDynamicConstructor<T> | null {
        const res = injector.get(selector as any, ELEMENT_NOT_FOUND);
        if (res === ELEMENT_NOT_FOUND) {
            return null;
        }
        return res;
    }

    private isGlobalSelector(selector: string): boolean {
        return this.contains(selector);
    }

    private isModuleSelector(selector: string): boolean {
        const moduleSelector = this.getModuleSelector(selector);
        return this.dynamicModules.contains(moduleSelector);
    }

    private getModuleSelector(selector: string): string {
        const parts = selector.split('/');

        const isScopedPackage = selector.startsWith('@');
        if (isScopedPackage) {
            return parts.slice(0, 2).join('/');
        }

        return parts[0];
    }

    private simplifyExtSelector(selector: string): string {
        // TODO:WORKAROUND: check for duplication ext-ext-common
        const isExtNotAPartOfName = !this.dynamicModules.contains('ext-' + selector.split('/')[0]);
        if (selector.startsWith('ext-') && isExtNotAPartOfName) {
            // eslint-disable-next-line no-console
            console.error(`Deprecated solution. Will be removed in v6.0.0. Please, remove 'ext-' from selector='${selector}'.`);

            // TODO: ext-common and common issue
            //   .slice(4);
            return selector;
        }
        return selector;
    }
}
