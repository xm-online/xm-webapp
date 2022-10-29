import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { tail } from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { DynamicModulesService } from './dynamic-modules.service';

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

export interface DynamicComponentLoaderGetReturnValue {
    component: Type<any>,
    injector?: Injector,
    module?: NgModuleRef<any>
}

@Injectable({
    providedIn: 'root',
})
export class DynamicComponentLoaderService {

    private cache: Record<string, any> = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicModules: DynamicModulesService,
    ) {
    }

    // define return type
    public async find(inSelector: string, injector: Injector = this.moduleRef.injector): Promise<DynamicComponentLoaderGetReturnValue | null> {
        const selector = this.simplifyExtSelector(inSelector);

        const module = this.isExtSelector(selector) ? await this.loadModule(selector, injector) : null;

        const parentInjector = module?.injector || injector;
        if (!this.cache[selector]) {
            // TODO: Deprecated solution
            const providerResult = this.handleProviderSolution(selector, parentInjector);
            if (providerResult) {
                console.warn(`Immediately resolve deprecated solution usage. Use XmDynamicModule.forChild() instead. Selector: ${selector}`);
                return {
                    component: providerResult,
                    injector: parentInjector,
                    module,
                };
            }

            this.cache[selector] = new Promise(async resolve => {
                const component = this.findComponentInRegistry(parentInjector, selector);

                if (!component) {
                    this.cache[selector] = null;
                    resolve(null);
                }
                const loaded: any = await component.loadChildren();
                resolve(loaded);
            });
        }

        return this.cache[selector].then(loaded => {
            if (this.isEntryModule(loaded)) {
                const compiledModule: any = createNgModule(loaded, parentInjector);
                if (compiledModule?.instance?.entry) {
                    console.warn(`Deprecated solution. Make ${selector} standalone component`);
                    return {
                        component: compiledModule.instance.entry,
                        injector: compiledModule.injector,
                        module: compiledModule,
                    };
                }
                // Unique case - module loader. Probably it's just for @xm-ngx/dashboard/default-dashboard module
                return {
                    component: loaded,
                    injector: compiledModule.injector,
                    module: compiledModule,
                };
            }

            // Standalone component.
            return {
                component: loaded,
                injector: parentInjector,
            };
        });
    }

    private isEntryModule(entry: any): boolean {
        return !!entry?.ɵmod;
    }

    private handleProviderSolution(selector: string, injector: Injector): any {
        // TODO: Angular does not allow search/store something inside injector by string valued key.
        // Deprecated!! Solution 1: get component by selector in provider.
        // Example: providers: [{provide: 'my-selector', useValue: MyComponent}]
        // todo: deprecated solution. we need to search only by injection token, not random string;
        const res = injector.get(!this.isExtSelector(selector) ? selector : selector.split('/')[1], ELEMENT_NOT_FOUND);
        if (res === ELEMENT_NOT_FOUND) {
            return null;
        }
        return res;
    }

    // type -> dynamic component types enum/type/etc
    private findComponentInRegistry(injector: Injector, selector: string, type: string = 'any'): any {

        if(this.isCoreComponent(selector)) {
            const xmEntries = this.moduleRef.injector.get(XM_DYNAMIC_ENTRIES, [{}]);
            const components = Object.assign({}, ...xmEntries);
            return (components[type] && components[type][selector]) || components['any'][selector];
        }

        const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
        const entries = injector.get(XM_DYNAMIC_ENTRIES, [{}]);
        const components = Object.assign({}, ...entries);
        return (components[type] && components[type][componentSelector]) || components['any'][componentSelector];
    }

    private isExtSelector(selector: string): boolean {
        return !this.isCoreComponent(selector) && this.isSelectorIncludesExtension(selector);
    }

    private isSelectorIncludesExtension(selector: string): boolean {
        return selector.includes('/');
    }

    private loadModule(selector: string, injector: Injector): any {
        return this.dynamicModules.find(selector.split('/')[0], injector);
    }

    private isCoreComponent(selector: string): boolean {
        return selector.startsWith('@xm-ngx/');
    }

    private simplifyExtSelector(selector: string): string {
        if (selector.startsWith('ext-')) {
            console.warn(`Deprecated solution! Please, remove 'ext-' from selector '${selector}'`);
            return selector.slice(4);
        }
        return selector;
    }
}
