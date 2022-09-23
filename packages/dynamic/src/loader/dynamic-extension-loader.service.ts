import { createNgModule, Injectable, Injector, NgModuleRef } from '@angular/core';

import { TenantModuleLoaderService } from '../extentions/tenant-module-loader.service';
import { XmDynamicExtensionConstructor } from '../extentions/xm-dynamic-extension.injectors';

@Injectable({
    providedIn: 'root',
})
export class DynamicExtensionLoaderService {

    constructor(
        private tenantModuleLoaderService: TenantModuleLoaderService,
        private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<NgModuleRef<T> | null> {
        if (!selector || typeof selector !== 'string') {
            return null;
        }

        const entry = this.tenantModuleLoaderService.getEntry<T>(selector);
        const moduleCtor: XmDynamicExtensionConstructor<T> = await entry.loadChildren();

        return createNgModule(moduleCtor, injector);
    }
}
