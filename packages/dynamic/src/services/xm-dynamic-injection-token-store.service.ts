import { Injectable, InjectionToken } from '@angular/core';
import { XmDynamicService } from '../../services/xm-dynamic-service-factory.service';


@Injectable()
export class XmDynamicInjectionTokenStoreService {

    private mapper: Record<string, InjectionToken<unknown>> = {};

    public resolve<T extends XmDynamicService>(key: string): InjectionToken<T> {
        if (!this.mapper[key]) {
            this.mapper[key] = new InjectionToken<T>(key);
        }
        return this.mapper[key];
    }

}
