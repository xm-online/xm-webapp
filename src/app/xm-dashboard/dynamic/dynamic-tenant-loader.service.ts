import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { ELEMENT_NOT_FOUND } from '@xm-ngx/dynamic';
import { DynamicLoaderService, DynamicNgModuleFactory } from './dynamic-loader.service';

@Injectable({
    providedIn: 'root',
})
export class DynamicTenantLoaderService {

    constructor(
        private loaderService: DynamicLoaderService,
        private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public load<T>(selector: string): Promise<Type<T> | null> {
        return this.loadTenantComponent(selector);
    }

    public async loadTenantComponent<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<Type<T> | null> {
        if (!selector || typeof selector !== 'string') {
            return null;
        }

        if (!selector.startsWith('ext-')) {
            console.warn('ERROR: The selector must starts with "ext-"');
            return null;
        }

        const moduleFactoryRef = await this.loadTenantModuleFactory(selector);
        const module = moduleFactoryRef.create(injector);
        const localSelector = selector.split('/')[1];
        const componentTypeOrLazyComponentType = module.injector.get(localSelector, ELEMENT_NOT_FOUND);
        if (componentTypeOrLazyComponentType === ELEMENT_NOT_FOUND) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: The "${selector}" does not exist in the ${moduleFactoryRef} module!`);
            return null;
        }

        if (componentTypeOrLazyComponentType instanceof Promise) {
            const moduleFactoryRef = await this.loaderService.loadModuleFactory<T>(componentTypeOrLazyComponentType);
            return this.loaderService.getComponent(moduleFactoryRef, module.injector);
        } else {
            return componentTypeOrLazyComponentType;
        }
    }

    public loadTenantModuleFactory<T>(selector: string): Promise<DynamicNgModuleFactory<T>> {
        const module = selector.split('/')[0];
        const modulePath = this.resolveTenantModulePath(module);
        return this.loaderService.loadModuleFactory(modulePath);
    }

    public resolveTenantModulePath(module: string): string {
        const commons: string[] = ['ext-common', 'ext-common-csp', 'ext-common-entity'];

        const rootClass = module.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('');
        const extName = module.split('-').reverse()[0];
        const extRootClass = `${extName.charAt(0).toUpperCase() + extName.slice(1)}WebappExtModule`;
        let modulePath: string;
        if (commons.includes(module)) {
            modulePath = `src/app/ext-commons/${module}/${module}.module#${rootClass}Module`;
        } else {
            modulePath = `src/app/ext/${extName}-webapp-ext/module/${extName}-webapp-ext.module#${extRootClass}`;
        }

        return modulePath;
    }

}
