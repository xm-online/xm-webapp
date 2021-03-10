import { TestBed } from '@angular/core/testing';

import { PROXY_INTERCEPTOR_EXCLUDED_URLS, PROXY_INTERCEPTOR_URL, ProxyInterceptor } from './proxy.interceptor';

describe('ProxyInterceptor', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            ProxyInterceptor,
            { provide: PROXY_INTERCEPTOR_URL, useValue: '' },
            { provide: PROXY_INTERCEPTOR_EXCLUDED_URLS, useValue: '' },
        ],
    }));

    it('should be created', () => {
        const interceptor: ProxyInterceptor = TestBed.inject<ProxyInterceptor>(ProxyInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
