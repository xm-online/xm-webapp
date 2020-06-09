import { TestBed } from '@angular/core/testing';

import { DashboardsManagerService } from './dashboards-manager.service';

describe('DashboardsManagerService', () => {
  let service: DashboardsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
