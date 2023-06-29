import { Injectable, Injector, Type } from '@angular/core';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic/src/loader/xm-dynamic-component-registry.service';
import { XmDynamicSelector, XmDynamicWithConfig } from '@xm-ngx/dynamic/src/interfaces';
import { XmConfig } from '@xm-ngx/shared/interfaces';

export interface XmDynamicService<C = XmConfig> extends XmDynamicWithConfig<C> {
}

@Injectable()
export class XmDynamicServiceFactory {
    constructor(
        private xmDynamicComponentRegistry: XmDynamicComponentRegistry,
        private injector: Injector,
    ) {
    }

    public factory<T>(serviceConstructor: Type<T> | any, parentInjector = this.injector): T {
        const injector = Injector.create({
            providers: [serviceConstructor],
            parent: parentInjector,
        });
        return injector.get<T>(serviceConstructor);
    }

    public async findAndFactory<T>(selector: XmDynamicSelector, injector = this.injector): Promise<T> {
        const serviceConstructor = await this.xmDynamicComponentRegistry.find<Type<T>>(selector, injector);
        return this.factory<T>(serviceConstructor.componentType, injector);
    }


}
