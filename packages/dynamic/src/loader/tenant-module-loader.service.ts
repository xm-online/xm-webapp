import { Injectable } from '@angular/core';
import { XmDynamicNgModuleFactory } from '@xm-ngx/dynamic';
import { ModuleLoader } from './module-loader';

@Injectable({ providedIn: 'root' })
export class TenantModuleLoaderService {

    constructor(
        private moduleLoader: ModuleLoader,
    ) {
    }

    public loadTenantModuleFactory<T>(selector: string): Promise<XmDynamicNgModuleFactory<T>> {
        const modulePath = this.resolveTenantModulePath(selector);
        return this.moduleLoader.loadModuleFactory(modulePath);
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
