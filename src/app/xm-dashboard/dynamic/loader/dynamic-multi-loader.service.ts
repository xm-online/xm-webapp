import { Injectable, Type } from '@angular/core';
import { DynamicLoaderService } from '../dynamic-loader.service';
import { DynamicTenantLoaderService } from '../dynamic-tenant-loader.service';
import { DynamicLoader } from './dynamic-loader';

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
        if (selector.startsWith('ext')) {
            return (await this.dynamicTenantLoaderService.loadAndResolve(selector)).componentType;
        } else {
            return (await this.dynamicLoaderService.loadAndResolve(selector)).componentType;
        }
    }
}
