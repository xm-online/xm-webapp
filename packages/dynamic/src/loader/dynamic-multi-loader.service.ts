import { ComponentFactory, Injectable, Injector, Type } from '@angular/core';
import { DynamicTenantLoaderService } from '../extentions/dynamic-tenant-loader.service';
import {XmDynamicEntry, XmDynamicEntryType} from '../interfaces';
import { DynamicLoader } from './dynamic-loader';
import { DynamicLoaderService } from './dynamic-loader.service';
import { DynamicSearcher } from '../searcher/dynamic-searcher';

@Injectable({
    providedIn: 'root',
})
export class DynamicMultiLoaderService implements DynamicLoader {

    constructor(
        private dynamicLoaderService: DynamicLoaderService,
        private dynamicSearcher: DynamicSearcher,
        private dynamicTenantLoaderService: DynamicTenantLoaderService,
    ) {
    }

    public async load<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<Type<T> | null> {
        return (await this.loadAndResolve(selector, options)).componentType;
    }

    public async loadAndResolve<T>(
        selector: string,
        options?: { injector?: Injector },
        type?: XmDynamicEntryType,
    ): Promise<ComponentFactory<T> | null> {
        return await this.dynamicLoaderService.loadAndResolve(selector, options?.injector, type)
            || await this.dynamicTenantLoaderService.loadAndResolve(selector, options?.injector, type);
    }

    public async getEntry<T>(
        selector: string,
        options?: { injector?: Injector; }, type?: XmDynamicEntryType): Promise<XmDynamicEntry<T>> {
        return await this.dynamicSearcher.getEntry(selector, options, type)
            || await this.dynamicTenantLoaderService.getEntry(selector, options?.injector, type);
    }
}
