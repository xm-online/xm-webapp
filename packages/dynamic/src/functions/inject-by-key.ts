import { inject, InjectOptions } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from '../services/xm-dynamic-injection-token-store.service';

export const injectByKey = <R>(key: string, options?: InjectOptions): R => {
    const injectionTokenService = inject<XmDynamicInjectionTokenStoreService>(XmDynamicInjectionTokenStoreService);
    return inject<R>(injectionTokenService.resolve(key), options);
};
