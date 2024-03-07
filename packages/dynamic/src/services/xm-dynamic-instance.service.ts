import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from '@xm-ngx/dynamic';

@Injectable()
export class XmDynamicInstanceService {
    private injector = inject(Injector);
    private dynamicInjectionTokenStoreService = inject(XmDynamicInjectionTokenStoreService);

    public getControllerByKey(key: string): any {
        if(!key) {
            return;
        }
        const providerToken: ProviderToken<any> = this.dynamicInjectionTokenStoreService.resolve(key);
        return this.injector.get(providerToken, undefined,{optional: true});
    }
}
