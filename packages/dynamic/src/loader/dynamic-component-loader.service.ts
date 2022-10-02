import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { tail } from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { DynamicExtensionLoaderService } from './dynamic-extension-loader.service';

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

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicExtensionLoaderService: DynamicExtensionLoaderService,
    ) {
    }

    // define return type
    public async get<T>(selector: string): Promise<DynamicComponentLoaderGetReturnValue | null> {
        const isStickySelector = (selector: string): boolean => {
            return selector.startsWith('@xm-ngx/') || !this.isSelectorIncludesExtension(selector);
        };

        const module = !isStickySelector(selector) ? await this.loadModule(selector, this.moduleRef.injector) : null;

        const targetInjector = module?.injector || this.moduleRef.injector;

        // TODO: Angular does not allow search/store something inside injector by string valued key.
        // Deprecated!! Solution 1: get component by selector in provider.
        // Example: providers: [{provide: 'my-selector', useValue: MyComponent}]
        // todo: deprecated solution. we need to search only by injection token, not random string;
        const componentInProviderr = targetInjector.get(isStickySelector(selector) ? selector : selector.split('/')[1], ELEMENT_NOT_FOUND);
        if (componentInProviderr !== ELEMENT_NOT_FOUND) {
            return {
                component: componentInProviderr,
                injector: targetInjector,
                module
            };
        }

        const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
        const type = 'any';
        const temp = targetInjector.get(XM_DYNAMIC_ENTRIES, {});
        const components = Object.assign({}, ...temp);
        const component = (components[type] && components[type][componentSelector]) || components['any'][componentSelector];
        // TODO: components will be inside object, not array.
        // const providers = targetInjector.get(XM_DYNAMIC_ENTRIES, []);
        // const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
        // const component = components.find((i) => i.selector === componentSelector) || null;

        if (!component) {
            return null;
        }
        const loaded: any = await component.loadChildren();
        if (loaded && loaded.ɵmod) {
            const compiledModule: any = createNgModule(loaded, targetInjector);
            if (compiledModule?.instance?.entry) {
                console.warn(`Deprecated solution. Make ${selector} standalone component`);
                return {
                    component: compiledModule.instance.entry,
                    injector: compiledModule.injector,
                    module: compiledModule
                };
            }
            return {component: loaded, injector: compiledModule.injector, module: compiledModule};
        }

        return {component: loaded, injector: targetInjector};
    }

    private isSelectorIncludesExtension(selector: string): boolean {
        return selector.includes('/');
    }

    private loadModule(selector: string, injector: Injector): any {
        const mselector = selector.split('/')[0];
        // Deprecated! all selectors should not contain 'ext-' prefix.
        return this.dynamicExtensionLoaderService.loadAndResolve(mselector.startsWith('ext-') ? mselector.slice(4) : mselector, injector);
    }
}
