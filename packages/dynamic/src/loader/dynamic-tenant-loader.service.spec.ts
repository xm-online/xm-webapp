import { TestBed } from '@angular/core/testing';

import { DynamicTenantLoaderService } from './dynamic-tenant-loader.service';

describe('DynamicTenantLoaderService', () => {
  let service: DynamicTenantLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicTenantLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
