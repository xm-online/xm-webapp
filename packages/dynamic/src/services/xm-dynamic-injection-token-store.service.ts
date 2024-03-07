import { inject, Injectable, InjectionToken, Injector, ProviderToken } from '@angular/core';
import { XmDynamicService } from '../../services/xm-dynamic-service-factory.service';


@Injectable()
export class XmDynamicInjectionTokenStoreService {

    private mapper: Record<string, InjectionToken<unknown>> = {};

    private injector = inject(Injector);

    public resolve<T extends XmDynamicService>(key: string): InjectionToken<T> {
        if (!this.mapper[key]) {
            this.mapper[key] = new InjectionToken<T>(key);
        }
        return this.mapper[key];
    }

    public getControllerByKey(key: string): any {
        if(!key) {
            return;
        }
        const providerToken: ProviderToken<any> = this.resolve(key);
        return this.injector.get(providerToken, undefined,{optional: true});
    }
}
