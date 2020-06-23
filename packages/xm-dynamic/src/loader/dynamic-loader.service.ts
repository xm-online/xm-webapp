import {
    Compiler,
    ComponentFactory,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    NgModuleRef,
    Optional,
    Type,
} from '@angular/core';

import { DynamicNgModuleFactory } from '../dynamic.interfaces';
import { DynamicSearcher } from '../searcher/dynamic-searcher';


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
        @Optional() private compiler: Compiler,
        private moduleRef: NgModuleRef<unknown>,
        private dynamicSearcher: DynamicSearcher,
        private loader: NgModuleFactoryLoader,
    ) {
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<ComponentFactory<T> | null> {
        const moduleFac = await this.dynamicSearcher.search(selector, {injector});

        if (moduleFac instanceof NgModuleFactory || isModuleDef(moduleFac)) {
            const moduleFactory = await this.loadModuleFactory<T>(moduleFac as DynamicNgModuleFactory<T>);
            const moduleRef = moduleFactory.create(injector);
            const componentRef = moduleRef.instance.entry;
            return moduleRef.componentFactoryResolver.resolveComponentFactory(componentRef);
        } else if (isComponentDef(moduleFac)) {
            return this.moduleRef.componentFactoryResolver.resolveComponentFactory(moduleFac as Type<T>);
        } else {
            return null;
        }
    }

    public async loadModuleFactory<T>(
        moduleImport: Promise<DynamicNgModuleFactory<T>> | DynamicNgModuleFactory<T> | string,
    ): Promise<DynamicNgModuleFactory<T>> {
        let elementModuleOrFactory: DynamicNgModuleFactory<T>;
        if (typeof moduleImport === 'string') {
            elementModuleOrFactory = await this.loader.load(moduleImport);
        } else if (moduleImport instanceof Promise) {
            elementModuleOrFactory = await moduleImport;
        } else {
            elementModuleOrFactory = moduleImport;
        }

        let elModuleFactory: DynamicNgModuleFactory<T>;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elModuleFactory = elementModuleOrFactory;
        } else {
            elModuleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as DynamicNgModuleFactory<T>;
        }

        return elModuleFactory;
    }

}
