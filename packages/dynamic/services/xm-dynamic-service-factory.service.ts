import { Injectable, Injector, Type } from '@angular/core';
import { XmDynamicComponentRegistry } from '../src/loader/xm-dynamic-component-registry.service';
import { XmConfig } from '@xm-ngx/interfaces';
import { XmDynamicConstructor, XmDynamicSelector, XmDynamicWithConfig } from '../src/interfaces';

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

    public async find<T>(selector: XmDynamicSelector, injector = this.injector): Promise<XmDynamicConstructor<T>> {
        const serviceConstructor = await this.xmDynamicComponentRegistry.find<T>(selector, injector);
        return serviceConstructor.componentType;
    }

    public async findAndFactory<T>(selector: XmDynamicSelector, injector = this.injector): Promise<T> {
        const componentType = await this.find<T>(selector, injector);
        return this.factory<T>(componentType, injector);
    }

}
