import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from './xm-dynamic-injection-token-store.service';

@Injectable()
export class XmDynamicInstanceService {
    private injector = inject(Injector);
    private dynamicInjectionTokenStoreService = inject(XmDynamicInjectionTokenStoreService);

    public getControllerByKey(key: string): any {
        if (!key) {
            return null;
        }
        const providerToken: ProviderToken<any> = this.dynamicInjectionTokenStoreService.resolve(key);
        return this.injector.get(providerToken, undefined, {optional: true});
    }
}
