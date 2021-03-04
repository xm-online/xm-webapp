import { TestBed } from '@angular/core/testing';

import { DynamicInjectorSearcherService } from './dynamic-injector-searcher.service';

describe('DynamicInjectorSearcherService', () => {
  let service: DynamicInjectorSearcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject<DynamicInjectorSearcherService>(DynamicInjectorSearcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
