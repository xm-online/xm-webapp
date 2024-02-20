import { inject, InjectOptions, Type } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from '../services/xm-dynamic-injection-token-store.service';

export const injectByKey = <R>(keyOrType: string | Type<R>, options?: InjectOptions): R => {
    const dynamicTokenStore = inject(XmDynamicInjectionTokenStoreService);

    const resolvedKey = typeof keyOrType === 'string'
        ? dynamicTokenStore.resolve(keyOrType)
        : keyOrType;

    return inject<R>(resolvedKey, options);
};
