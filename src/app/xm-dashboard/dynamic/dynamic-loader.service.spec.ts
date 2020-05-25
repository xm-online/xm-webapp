import { TestBed } from '@angular/core/testing';

import { DynamicLoaderService } from './dynamic-loader.service';

describe('DynamicLoaderService', () => {
  let service: DynamicLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
