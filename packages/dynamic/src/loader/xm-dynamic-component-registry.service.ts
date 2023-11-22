import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { Dictionary, flatten, keyBy, tail } from 'lodash';
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
export class XmDynamicComponentRegistry {

    private cache: Dictionary<Promise<XmDynamicComponentRecord<unknown>>> = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicModules: XmDynamicModuleRegistry,
    ) {
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

        if (this.isModuleSelector(fullSelector)) {
            return this.cache[fullSelector] = this.loadModule<T>(fullSelector, injector);
        }

        return this.cache[fullSelector] = this.resolveComponent<T>(fullSelector, injector, null);
    }

    private async loadModule<T>(
        selector: string,
        injector: Injector,
    ): Promise<XmDynamicComponentRecord<T>> {
        const moduleSelector = selector.split('/')[0];
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
                // modules HAVE TO be supported forever!
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

    private findComponentInRegistry(injector: Injector, selector: string): XmDynamicEntry {

        if (this.isCoreComponent(selector)) {
            const entries = this.moduleRef.injector.get(XM_DYNAMIC_ENTRIES, [[]]);
            const flattened = flatten(entries);
            const dynamicMap = keyBy(flattened, 'selector');

            return dynamicMap[selector];
        }

        const entries = injector.get(XM_DYNAMIC_ENTRIES, [[]]);
        const flattened = flatten(entries);
        const dynamicMap = keyBy(flattened, 'selector');

        const componentSelector = selector.includes('/')
            ? tail(selector.split('/')).join('/')
            : selector;
        return dynamicMap[componentSelector];
    }

    private isModuleSelector(selector: string): boolean {
        return !this.isCoreComponent(selector)
            && this.isSelectorIncludesExtension(selector);
    }

    private isSelectorIncludesExtension(selector: string): boolean {
        return selector.includes('/');
    }


    private isCoreComponent(selector: string): boolean {
        return selector.startsWith('@xm-ngx/');
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
