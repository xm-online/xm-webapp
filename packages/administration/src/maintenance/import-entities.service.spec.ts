import { TestBed } from '@angular/core/testing';

import { ImportEntitiesService } from './import-entities.service';

describe('ImportEntitiesService', () => {
  let service: ImportEntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportEntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
