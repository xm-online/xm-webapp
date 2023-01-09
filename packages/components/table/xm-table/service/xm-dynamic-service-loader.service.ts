import { Injectable, NgModuleRef, ProviderToken } from '@angular/core';
import { ArgumentException } from '@xm-ngx/shared/exceptions';

@Injectable({ providedIn: 'any' })
export class XmDynamicServiceLoader {
    constructor(private moduleRef: NgModuleRef<unknown>) {
    }

    public getService<T>(injector: string | ProviderToken<T>): T | null {
        const service = this.moduleRef.injector.get(injector, null);
        if (!service) {
            throw new ArgumentException('Can`t find service!');
        }
        return service;
    }
}
