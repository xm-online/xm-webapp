import { ComponentFactory, Injectable, Injector, NgModuleFactory, NgModuleRef, Type } from '@angular/core';
import {XmDynamicEntryType, XmDynamicNgModuleFactory} from '../interfaces';
import { DynamicSearcher } from '../searcher/dynamic-searcher';
import { ModuleLoader } from './module-loader';


export function isComponentDef<T extends { ɵcmp: unknown }>(def: Type<T> | any): boolean {
    return def && def.ɵcmp;
}

export function isModuleDef<T extends { ɵmod: unknown }>(def: Type<T> | any): boolean {
    return def && def.ɵmod;
}

@Injectable({
    providedIn: 'root',
})
export class DynamicLoaderService {

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicSearcher: DynamicSearcher,
        private moduleLoaderService: ModuleLoader,
    ) {
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
        type?: XmDynamicEntryType,
    ): Promise<ComponentFactory<T> | null> {
        const moduleFac = await this.dynamicSearcher.search(selector, { injector }, type);

        if (moduleFac instanceof NgModuleFactory || isModuleDef(moduleFac)) {
            const moduleFactory = await this.moduleLoaderService.loadModuleFactory<T>(moduleFac as XmDynamicNgModuleFactory<T>);
            const moduleRef = moduleFactory.create(injector);
            const componentRef = moduleRef.instance.entry;
            return moduleRef.componentFactoryResolver.resolveComponentFactory(componentRef);
        } else if (isComponentDef(moduleFac)) {
            return this.moduleRef.componentFactoryResolver.resolveComponentFactory(moduleFac as Type<T>);
        }
        return null;

    }

}
