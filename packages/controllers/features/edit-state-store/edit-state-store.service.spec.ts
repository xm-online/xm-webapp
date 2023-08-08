import { TestBed } from '@angular/core/testing';

import { EditStateStoreService } from './edit-state-store.service';

describe('EditStateService', () => {
  let service: EditStateStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditStateStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
