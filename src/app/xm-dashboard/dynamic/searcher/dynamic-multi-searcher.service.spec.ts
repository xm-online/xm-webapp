import { TestBed } from '@angular/core/testing';

import { DynamicMultiSearcherService } from './dynamic-multi-searcher.service';

describe('DynamicMultiSearcherService', () => {
  let service: DynamicMultiSearcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicMultiSearcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
