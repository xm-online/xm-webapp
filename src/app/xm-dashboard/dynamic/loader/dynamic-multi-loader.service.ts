import { ComponentFactory, Injectable, Type } from '@angular/core';
import { DynamicLoader } from './dynamic-loader';
import { DynamicLoaderService } from './dynamic-loader.service';
import { DynamicTenantLoaderService } from './dynamic-tenant-loader.service';

@Injectable({
    providedIn: 'root',
})
export class DynamicMultiLoaderService implements DynamicLoader {

    constructor(
        private dynamicLoaderService: DynamicLoaderService,
        private dynamicTenantLoaderService: DynamicTenantLoaderService,
    ) {
    }

    public async load<T>(selector: string): Promise<Type<T> | null> {
        return (await this.loadAndResolve(selector)).componentType;
    }

    public async loadAndResolve<T>(selector: string): Promise<ComponentFactory<T> | null> {
        if (selector.startsWith('ext')) {
            return await this.dynamicTenantLoaderService.loadAndResolve(selector);
        } else {
            return await this.dynamicLoaderService.loadAndResolve(selector);
        }
    }
}
