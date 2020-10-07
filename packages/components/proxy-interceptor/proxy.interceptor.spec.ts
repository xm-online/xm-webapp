import { TestBed } from '@angular/core/testing';

import { ProxyInterceptor } from './proxy.interceptor';

describe('ProxyInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ProxyInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ProxyInterceptor = TestBed.inject(ProxyInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
