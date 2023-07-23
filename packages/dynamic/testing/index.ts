import { Component, Injector, Input } from '@angular/core';
import { XmDynamicComponentRegistry, XmDynamicSelector } from '@xm-ngx/dynamic';
import { XmDynamicComponentRecord } from '@xm-ngx/dynamic/src/loader/xm-dynamic-component-registry.service';

@Component({ selector: 'xm-dynamic-instance', template: '', standalone: true })
export class XmDynamicInstanceComponent {
    @Input() public config: unknown;
}

export class MockXmDynamicComponentRegistry extends XmDynamicComponentRegistry {
    constructor() {
        super(null, null);
    }

    public find<T>(
        inSelector: XmDynamicSelector,
        injector: Injector = null,
    ): Promise<XmDynamicComponentRecord<T>> {
        return Promise.resolve({
            componentType: XmDynamicInstanceComponent as any,
            injector: injector,
            ngModuleRef: null,
        });
    }
}
